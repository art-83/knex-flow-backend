const webConnectionConfig = {
  http: {
    port: Number(process.env.HTTP_PORT),
  },
  websocket: {
    port: Number(process.env.WEBSOCKET_PORT),
    rateLimit: {
      maxMessages: Number(process.env.WEBSOCKET_RATE_LIMIT_MAX_MESSAGES),
      windowMs: Number(process.env.WEBSOCKET_RATE_LIMIT_WINDOW_MS),
    },
  },
};

export default webConnectionConfig;
