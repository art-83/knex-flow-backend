import { describe, it, expect, vi, beforeEach } from 'vitest';
import { container } from 'tsyringe';

import { FindPendingPaymentByOrderService } from '../../src/modules/payments/services/payments/find-pending-payment-by-order.service';
import { IRepositoryProvider } from '../../src/shared/infra/orm/providers/repository.provider';
import { Payment } from '../../src/modules/payments/infra/orm/entities/payment.entity';
import { OrderStatus } from '../../src/modules/events/infra/orm/enums/order-status.enum';
import { PaymentStatus } from '../../src/modules/payments/infra/orm/enums/payment-status.enum';
import { AppError } from '../../src/shared/infra/http/errors/app-error';

describe('FindPendingPaymentByOrderService', () => {
  const paymentRepositoryProvider = {
    find: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    container.reset();
    container.registerInstance<IRepositoryProvider<Payment>>('PaymentRepositoryProvider', paymentRepositoryProvider);
  });

  it('returns stored PIX for the latest pending payment of a pending order', async () => {
    const payment = {
      id: 'payment-1',
      amount: 75,
      method: 'PIX',
      status: PaymentStatus.PENDING,
      external_id: 'gateway-1',
      pix_br_code: 'pix-code',
      pix_br_code_base64: 'base64',
      pix_expires_at: new Date('2026-06-19T13:00:00.000Z'),
      pix_amount_cents: 7500,
      created_at: new Date('2026-06-19T12:00:00.000Z'),
      order: {
        id: 'order-1',
        status: OrderStatus.PENDING,
        user: { id: 'user-1' },
      },
    } as Payment;

    paymentRepositoryProvider.find.mockResolvedValue([payment]);

    const service = container.resolve(FindPendingPaymentByOrderService);
    const result = await service.execute('user-1', 'order-1');

    expect(result.payment.id).toBe('payment-1');
    expect(result.gatewayPayment.brCode).toBe('pix-code');
  });

  it('throws when no pending payment exists for the order', async () => {
    paymentRepositoryProvider.find.mockResolvedValue([]);

    const service = container.resolve(FindPendingPaymentByOrderService);

    await expect(service.execute('user-1', 'order-1')).rejects.toBeInstanceOf(AppError);
  });
});
