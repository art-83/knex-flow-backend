import { describe, it, expect } from 'vitest';

import { abacatepayConfig } from '../../src/config/abacatepay.config';
import { orderConfig } from '../../src/config/order.config';

describe('abacatepayConfig', () => {
  it('uses order pending TTL as PIX expiration in seconds', () => {
    expect(abacatepayConfig.pix.expiresIn).toBe(orderConfig.pendingTtlMinutes * 60);
  });

  it('matches ORDER_PENDING_TTL_MINUTES from test environment', () => {
    expect(orderConfig.pendingTtlMinutes).toBe(Number(process.env.ORDER_PENDING_TTL_MINUTES));
    expect(abacatepayConfig.pix.expiresIn).toBe(Number(process.env.ORDER_PENDING_TTL_MINUTES) * 60);
  });
});
