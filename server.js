const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 5174 });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('message', (message) => {
    // Broadcast para todos os clientes conectados
    const data = message.toString();
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

console.log('WebSocket server running on port 5174'); 