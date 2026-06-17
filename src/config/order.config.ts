const orderConfig = {
  pendingTtlMinutes: Number(process.env.ORDER_PENDING_TTL_MINUTES ?? 30),
  expirationIntervalMs: Number(process.env.ORDER_EXPIRATION_INTERVAL_MS ?? 60_000),
};
export { orderConfig };
