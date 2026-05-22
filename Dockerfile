FROM node:20-slim
WORKDIR /
COPY package*.json ./
RUN npm ci --omit=dev
COPY dist ./dist
EXPOSE 3000

# Default process (Compose overrides for workers). Node as PID 1 receives SIGTERM from Docker.
CMD ["node", "dist/shared/infra/http/server.js"]