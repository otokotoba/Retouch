# syntax=docker/dockerfile:1

FROM node:20.12.2-slim AS base

WORKDIR /app
EXPOSE 3001

FROM base AS dev

COPY package*.json .
RUN --mount=type=cache,target=/root/.npm \
  npm ci --include=dev

COPY . .
ARG CONFIG
ARG BOT_SITES
ARG DEBUG
RUN npm run build

CMD ["node", "dist/start-bot.js"]

FROM base AS prod

ENV NODE_ENV=production

COPY package*.json .
RUN --mount=type=cache,id=s/273a7847-5034-41cf-8c77-3a8ef9afaf44-/root/.npm,target=/root/.npm \
  npm ci --omit=dev

COPY . .
ARG CONFIG
ARG BOT_SITES
ARG DEBUG
RUN <<EOF
  mkdir config
  echo $CONFIG | base64 --decode > config/config.json
  echo $BOT_SITES | base64 --decode > config/bot-sites.json
  echo $DEBUG | base64 --decode > config/debug.json
  npm run build
EOF

CMD [ "node", "dist/start-manager.js" ]
