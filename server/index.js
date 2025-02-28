require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Log das variáveis de ambiente
console.log('=== Variáveis de ambiente ===');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('==========================');

// Configuração CORS
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'https://chat-duo.vercel.app'
    ].filter(Boolean);
    
    // Permitir requisições sem origin (como mobile apps ou Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('Origem bloqueada pelo CORS:', origin);
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));

// Rota de status
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    timestamp: new Date().toISOString(),
    port: process.env.PORT,
    env: process.env.NODE_ENV
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
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('=== Servidor iniciado ===');
  console.log(`Servidor rodando em: http://${HOST}:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
  console.log('======================');
}); 