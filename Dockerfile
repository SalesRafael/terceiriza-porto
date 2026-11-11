# Terceiriza Porto — Imagem de Produção (Node.js + Build React Estático)
FROM node:22-alpine

WORKDIR /app

# Instala dependências do backend
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Copia código do backend e build pré-compilado do frontend
COPY backend/src ./backend/src
COPY frontend/dist ./frontend/dist

EXPOSE 3001

ENV PORT=3001 \
    NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s --retries=5 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

WORKDIR /app/backend
CMD ["node", "src/server.js"]
