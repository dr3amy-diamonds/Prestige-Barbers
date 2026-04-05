# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY Backend/package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Stage 2: Runtime
FROM node:18-alpine

# Instalar dumb-init para manejar signals correctamente
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copiar node_modules del stage anterior
COPY --from=builder /app/node_modules ./node_modules

# Copiar aplicación
COPY Backend/ .

# Crear directorio para uploads
RUN mkdir -p uploads logs

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/auth/me', (r) => {if (r.statusCode !== 401) throw new Error(r.statusCode)})"

# Usar dumb-init para ejecutar la aplicación
ENTRYPOINT ["dumb-init", "--"]

# Comando por defecto
CMD ["node", "server.js"]
