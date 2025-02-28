// Configuração do ambiente
const config = {
  // URL base da API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  
  // Versão do app
  version: '1.0.0',
  
  // Timeout padrão para requisições (em ms)
  requestTimeout: 30000,
  
  // Configurações de desenvolvimento
  isDevelopment: import.meta.env.DEV,
  
  // URLs de desenvolvimento e produção
  urls: {
    development: 'http://localhost:8080',
    production: 'https://chat-duo-production.up.railway.app'
  }
};

export default config; 