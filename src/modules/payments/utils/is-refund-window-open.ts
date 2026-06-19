function isRefundWindowOpen(paidAt: Date, windowDays: number): boolean {
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  return Date.now() <= paidAt.getTime() + windowMs;
}
export { isRefundWindowOpen };
