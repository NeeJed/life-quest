FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm list --depth=0
RUN npm audit --audit-level=high
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup
USER appuser

COPY --from=builder /app/dist ./dist
ENV NODE_ENV=production
ENV PORT=4173
LABEL maintainer="belugin-denis2@rambler.ru" version="1.0"
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 CMD curl -f http://localhost:${PORT} || exit 1
EXPOSE 4173
ENTRYPOINT ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "4173"]
CMD []