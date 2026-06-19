import { describe, it, expect } from 'vitest';

import { mapStoredPixPayment } from '../../src/modules/payments/utils/map-stored-pix-payment';
import { Payment } from '../../src/modules/payments/infra/orm/entities/payment.entity';
import { PaymentMethod } from '../../src/modules/payments/infra/orm/enums/payment-method.enum';
import { PaymentStatus } from '../../src/modules/payments/infra/orm/enums/payment-status.enum';

describe('mapStoredPixPayment', () => {
  it('maps stored PIX fields into gateway response shape', () => {
    const payment = {
      id: 'payment-1',
      amount: 120,
      method: PaymentMethod.PIX,
      status: PaymentStatus.PENDING,
      external_id: 'gateway-1',
      pix_br_code: '00020126580014br.gov.bcb.pix',
      pix_br_code_base64: 'data:image/png;base64,fake',
      pix_expires_at: new Date('2026-06-19T13:00:00.000Z'),
      pix_amount_cents: 12_000,
    } as Payment;

    const result = mapStoredPixPayment(payment);

    expect(result.payment.id).toBe('payment-1');
    expect(result.gatewayPayment.brCode).toBe('00020126580014br.gov.bcb.pix');
    expect(result.gatewayPayment.amount).toBe(12_000);
    expect(result.gatewayPayment.expiresAt).toBe('2026-06-19T13:00:00.000Z');
  });
});
