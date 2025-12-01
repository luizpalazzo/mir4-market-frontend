# Stage 1: Build
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
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar script de inicialização
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expor porta (Railway usa variável PORT)
EXPOSE 80

# Iniciar nginx com script
CMD ["/start.sh"]

