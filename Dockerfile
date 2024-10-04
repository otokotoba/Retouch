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

FROM base AS prod

ENV NODE_ENV=production

COPY package*.json .
RUN --mount=type=cache,id=s/$RAILWAY_SERVICE_ID-/root/.npm,target=/root/.npm \
  npm ci --omit=dev

COPY . .
ARG CONFIG
ARG BOT_SITES
ARG DEBUG
ARG REDIS_URL
RUN <<EOF
  mkdir config
  echo $CONFIG | base64 --decode > config/config.json
  echo $BOT_SITES | base64 --decode > config/bot-sites.json
  echo $DEBUG | base64 --decode > config/debug.json
  npm run build
EOF

CMD [ "node", "dist/start-manager.js" ]
