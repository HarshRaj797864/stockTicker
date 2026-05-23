# syntax=docker/dockerfile:1.7

FROM node:22.12-alpine AS builder
WORKDIR /app

ENV DIRECT_URL=postgresql://placeholder@placeholder/placeholder
ENV DATABASE_URL=postgresql://placeholder@placeholder/placeholder

COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.js ./
RUN npm ci

COPY . .


FROM node:22.12-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S app && adduser -S app -G app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY prisma ./prisma
COPY prisma.config.js ./

COPY --from=builder /app/generated ./generated
COPY app.js server.js ./
COPY controllers ./controllers
COPY db ./db
COPY lib ./lib
COPY middleware ./middleware
COPY routes ./routes
COPY schemas ./schemas
COPY services ./services
COPY utils ./utils
COPY worker ./worker

RUN chown -R app:app /app
USER app
EXPOSE 10000

CMD ["node", "server.js"]
