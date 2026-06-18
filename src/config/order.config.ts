const orderConfig = {
  pendingTtlMinutes: Number(process.env.ORDER_PENDING_TTL_MINUTES),
  expirationIntervalMs: Number(process.env.ORDER_EXPIRATION_INTERVAL_MS),
};
export { orderConfig };
