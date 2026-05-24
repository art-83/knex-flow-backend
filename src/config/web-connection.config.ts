const webConnectionConfig = {
  http: {
    port: Number(process.env.HTTP_PORT),
  },
  websocket: {
    port: Number(process.env.WEBSOCKET_PORT),
  },
};

export default webConnectionConfig;
