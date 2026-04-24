FROM node:20-slim
WORKDIR /
COPY package*.json ./
RUN npm ci --omit=dev
COPY dist ./dist
COPY src/config/prod-ca-2021.crt dist/config/prod-ca-2021.crt
EXPOSE 3000

# Default process (Compose overrides for workers). Node as PID 1 receives SIGTERM from Docker.
CMD ["node", "dist/shared/infra/http/server.js"]