# syntax=docker/dockerfile:1

FROM node:20.12.2-slim AS base

WORKDIR /app
EXPOSE 3001

FROM base AS dev

COPY package*.json .
RUN --mount=type=cache,target=/root/.npm \
  npm ci --include=dev

COPY . .
RUN npm run build

CMD ["node", "dist/start-bot.js"]

FROM base AS test

ENV NODE_ENV=test

COPY package*.json .
RUN --mount=type=cache,target=/root/.npm \
  npm ci --include=dev

COPY . .
CMD ["npm", "test"]
