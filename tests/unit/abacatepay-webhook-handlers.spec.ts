import { describe, it, expect, vi, beforeEach } from 'vitest';
import { container } from 'tsyringe';

import { AbacatepayCompletedWebhookHandler } from '../../src/modules/payments/services/webhooks/abacatepay-completed.webhook-handler';
import { AbacatepayRefundedWebhookHandler } from '../../src/modules/payments/services/webhooks/abacatepay-refunded.webhook-handler';
import { PaymentStatus } from '../../src/modules/payments/infra/orm/enums/payment-status.enum';
import { IOrderRepositoryProvider } from '../../src/modules/events/infra/orm/repositories/providers/order-repository.provider';
import { IRepositoryProvider } from '../../src/shared/infra/orm/providers/repository.provider';
import { Payment } from '../../src/modules/payments/infra/orm/entities/payment.entity';
import { buildAbacatepayWebhookPayload } from '../helpers/webhook-fixtures';

describe('Abacatepay webhook handlers', () => {
  const orderRepositoryProvider = {
    confirmPaidOrder: vi.fn(),
    refundPaidOrder: vi.fn(),
  };

  const paymentRepositoryProvider = {
    find: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    container.reset();
    container.registerInstance<IOrderRepositoryProvider>('OrderRepositoryProvider', orderRepositoryProvider);
    container.registerInstance<IRepositoryProvider<Payment>>('PaymentRepositoryProvider', paymentRepositoryProvider);
  });

  it('confirms paid order on completed webhook', async () => {
    paymentRepositoryProvider.find.mockResolvedValue([{ id: 'payment-1' }]);
    orderRepositoryProvider.confirmPaidOrder.mockResolvedValue({ status: 'confirmed' });

    const handler = container.resolve(AbacatepayCompletedWebhookHandler);
    const payload = buildAbacatepayWebhookPayload({
      event: 'transparent.completed',
      orderId: 'order-1',
      externalId: 'external-1',
      status: PaymentStatus.PAID,
    });

    await handler.handle(payload);

    expect(orderRepositoryProvider.confirmPaidOrder).toHaveBeenCalledWith({
      order_id: 'order-1',
      payment_id: 'payment-1',
    });
  });

  it('refunds order on refunded webhook', async () => {
    paymentRepositoryProvider.find.mockResolvedValue([{ id: 'payment-1' }]);

    const handler = container.resolve(AbacatepayRefundedWebhookHandler);
    const payload = buildAbacatepayWebhookPayload({
      event: 'transparent.refunded',
      orderId: 'order-1',
      externalId: 'external-1',
      status: PaymentStatus.REFUNDED,
    });

    await handler.handle(payload);

    expect(orderRepositoryProvider.refundPaidOrder).toHaveBeenCalledWith('order-1', 'payment-1');
  });
});
