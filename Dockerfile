# Dockerfile otimizado para Railway
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json ./
COPY package-lock.json* ./

# Instalar dependências
RUN npm install --frozen-lockfile || npm install

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Copiar arquivos buildados
COPY --from=builder /app/dist ./dist

# Copiar servidor Node.js
COPY server.js ./

# Expor porta (Railway usa variável PORT)
EXPOSE 3000

# Servir aplicação usando servidor Node.js customizado
CMD ["node", "server.js"]
