import { describe, it, expect, vi, beforeEach } from 'vitest';
import { container } from 'tsyringe';

import { ExpirePendingOrdersService } from '../../src/modules/events/services/orders/expire-pending-orders.service';
import { IOrderRepositoryProvider } from '../../src/modules/events/infra/orm/repositories/providers/order-repository.provider';
import { OrderStatus } from '../../src/modules/events/infra/orm/enums/order-status.enum';
import { orderConfig } from '../../src/config/order.config';
import { Order } from '../../src/modules/events/infra/orm/entities/order.entity';

describe('ExpirePendingOrdersService', () => {
  const orderRepository = {
    find: vi.fn(),
    expirePendingOrder: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    container.reset();
    container.registerInstance<IOrderRepositoryProvider>('OrderRepositoryProvider', orderRepository);
  });

  it('expires pending orders older than configured TTL', async () => {
    const staleOrder = { id: 'order-1', status: OrderStatus.PENDING } as Order;
    orderRepository.find.mockResolvedValue([staleOrder]);
    orderRepository.expirePendingOrder.mockResolvedValue(undefined);

    const service = container.resolve(ExpirePendingOrdersService);
    const result = await service.execute();

    expect(result.expired_count).toBe(1);
    expect(orderRepository.find).toHaveBeenCalledWith({
      status: OrderStatus.PENDING,
      end_date: expect.any(Date),
    });

    const cutoff = orderRepository.find.mock.calls[0][0].end_date as Date;
    const expectedCutoff = Date.now() - orderConfig.pendingTtlMinutes * 60 * 1000;
    expect(Math.abs(cutoff.getTime() - expectedCutoff)).toBeLessThan(2_000);
    expect(orderRepository.expirePendingOrder).toHaveBeenCalledWith('order-1');
  });

  it('returns zero when there are no expired pending orders', async () => {
    orderRepository.find.mockResolvedValue([]);

    const service = container.resolve(ExpirePendingOrdersService);
    const result = await service.execute();

    expect(result.expired_count).toBe(0);
    expect(orderRepository.expirePendingOrder).not.toHaveBeenCalled();
  });
});
