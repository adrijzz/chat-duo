require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Configuração básica
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '50mb' }));

// Rota de status
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Armazenamento em memória (em produção você usaria um banco de dados)
let rooms = [];

// Rota para buscar salas
app.get('/api/rooms', (req, res) => {
  res.json({ rooms });
});

// Rota para atualizar salas
app.post('/api/rooms', (req, res) => {
  const { rooms: updatedRooms, deviceInfo } = req.body;
  
  try {
    // Atualizar salas mantendo dispositivos conectados
    rooms = updatedRooms.map(newRoom => {
      const existingRoom = rooms.find(r => r.id === newRoom.id);
      if (existingRoom) {
        // Manter dispositivos existentes e adicionar/atualizar o atual
        const devices = existingRoom.connectedDevices
          .filter(d => 
            Date.now() - d.lastActive < 5 * 60 * 1000 && // Remove inativos
            d.deviceId !== deviceInfo.deviceId // Remove versão antiga do dispositivo atual
          );
        
        return {
          ...newRoom,
          connectedDevices: [...devices, deviceInfo]
        };
      }
      return {
        ...newRoom,
        connectedDevices: [deviceInfo]
      };
    });

    res.json({ rooms });
  } catch (error) {
    console.error('Erro ao atualizar salas:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: error.message 
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`CORS configurado para: ${process.env.FRONTEND_URL || '*'}`);
}); 