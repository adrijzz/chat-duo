FROM node:18-slim

WORKDIR /app

# Copiar apenas os arquivos necessários
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar o resto dos arquivos
COPY . .

# Expor a porta que o servidor usa
EXPOSE 8080

# Comando para iniciar o servidor
CMD ["npm", "start"] 