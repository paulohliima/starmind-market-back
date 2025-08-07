# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app
ENV NODE_ENV=production

# Copia arquivos necessários
COPY package.json yarn.lock ./

# Instala dependências (todas, inclusive dev)
RUN yarn install

# Copia código-fonte
COPY . .

# Compila TypeScript
RUN yarn build

# Remove dev dependencies
RUN yarn install --production --ignore-scripts --prefer-offline

# Expondo a porta
EXPOSE 3000

# Comando para iniciar a app
CMD [ "node", "dist/index.js" ]
