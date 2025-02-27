const express = require('express');
const cors = require('cors');
const app = express();

// Configuração básica
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Armazenamento em memória (em produção você usaria um banco de dados)
let rooms = [];

// Rota para buscar salas
app.get('/api/rooms', (req, res) => {
  res.json({ rooms });
});

// Rota para atualizar salas
app.post('/api/rooms', (req, res) => {
  const { rooms: updatedRooms, deviceInfo } = req.body;
  
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
    return newRoom;
  });

  res.json({ rooms });
});

// Iniciar servidor
const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 