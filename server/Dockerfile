FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências primeiro
COPY package*.json ./

# Instalar dependências
RUN npm install --omit=dev

# Copiar resto do código
COPY . .

# Expor porta
EXPOSE 8080

# Comando para iniciar o servidor
CMD ["npm", "start"] 