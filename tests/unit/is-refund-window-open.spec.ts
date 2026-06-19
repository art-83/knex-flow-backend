import { describe, it, expect, vi, afterEach } from 'vitest';

import { isRefundWindowOpen } from '../../src/modules/payments/utils/is-refund-window-open';

describe('isRefundWindowOpen', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns true when refund window has not expired', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-19T12:00:00.000Z'));

    const paidAt = new Date('2026-06-18T12:00:00.000Z');

    expect(isRefundWindowOpen(paidAt, 2)).toBe(true);
  });

  it('returns false when refund window has expired', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-22T12:00:00.000Z'));

    const paidAt = new Date('2026-06-18T12:00:00.000Z');

    expect(isRefundWindowOpen(paidAt, 2)).toBe(false);
  });
});
