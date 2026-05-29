FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM alpine:latest AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist

CMD ["sh", "-c", "while true; do sleep 3600; done"]