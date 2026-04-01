# Multi-stage build : on exécute l'installation + tests dans un stage "builder" puis
# on ne copie en production que le strict nécessaire. Résultat : image plus petite
# (moins de surface d'attaque) et sans outils/devDependencies inutiles.

FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci || npm install

COPY . .
RUN npm test

FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY --from=builder /app/server.js ./server.js

EXPOSE 3000
CMD ["node", "server.js"]

