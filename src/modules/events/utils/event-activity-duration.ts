function getActivityDurationHours(startDate: Date, endDate: Date): number {
  const durationMs = endDate.getTime() - startDate.getTime();
  if (durationMs <= 0) return 0;

  return Math.round((durationMs / (1000 * 60 * 60)) * 100) / 100;
}
export { getActivityDurationHours };
