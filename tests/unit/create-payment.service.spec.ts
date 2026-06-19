import { describe, it, expect, vi, beforeEach } from 'vitest';
import { container } from 'tsyringe';

import { CreatePaymentService } from '../../src/modules/payments/services/payments/create-payment.service';
import { AppError } from '../../src/shared/infra/http/errors/app-error';
import { OrderStatus } from '../../src/modules/events/infra/orm/enums/order-status.enum';
import { PaymentStatus } from '../../src/modules/payments/infra/orm/enums/payment-status.enum';
import { IPaymentGatewayProvider } from '../../src/modules/payments/infra/gateways/providers/payment-gateway.provider';
import { IOrderRepositoryProvider } from '../../src/modules/events/infra/orm/repositories/providers/order-repository.provider';
import { IUserRepositoryProvider } from '../../src/modules/users/infra/orm/repositories/providers/user-repository.provider';
import { IRepositoryProvider } from '../../src/shared/infra/orm/providers/repository.provider';
import { Payment } from '../../src/modules/payments/infra/orm/entities/payment.entity';
import { User } from '../../src/modules/users/infra/orm/entities/user.entity';
import { Order } from '../../src/modules/events/infra/orm/entities/order.entity';

describe('CreatePaymentService', () => {
  const pixGatewayProvider = {
    createPayment: vi.fn(),
    refundPayment: vi.fn(),
  };

  const orderRepositoryProvider = {
    find: vi.fn(),
  };

  const userRepositoryProvider = {
    find: vi.fn(),
  };

  const paymentRepositoryProvider = {
    create: vi.fn(),
    find: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    container.reset();
    container.registerInstance<IPaymentGatewayProvider>('PixGatewayProvider', pixGatewayProvider);
    container.registerInstance<IOrderRepositoryProvider>('OrderRepositoryProvider', orderRepositoryProvider);
    container.registerInstance<IUserRepositoryProvider>('UserRepositoryProvider', userRepositoryProvider);
    container.registerInstance<IRepositoryProvider<Payment>>('PaymentRepositoryProvider', paymentRepositoryProvider);
    paymentRepositoryProvider.find.mockResolvedValue([]);
  });

  it('creates payment when order is pending and belongs to user', async () => {
    const user = { id: 'user-1', email: 'buyer@test.com' } as User;
    const order = {
      id: 'order-1',
      status: OrderStatus.PENDING,
      total_amount: 100,
      user,
    } as Order;

    userRepositoryProvider.find.mockResolvedValue([user]);
    orderRepositoryProvider.find.mockResolvedValue([order]);
    pixGatewayProvider.createPayment.mockResolvedValue({
      id: 'gateway-1',
      status: 'PENDING',
      amount: 100,
      brCode: 'pix-code',
      brCodeBase64: 'base64',
      expiresAt: new Date().toISOString(),
    });
    paymentRepositoryProvider.create.mockResolvedValue({ id: 'payment-1' });

    const service = container.resolve(CreatePaymentService);
    const result = await service.execute('user-1', { order_id: 'order-1', method: 'PIX' });

    expect(result.payment.id).toBe('payment-1');
    expect(pixGatewayProvider.createPayment).toHaveBeenCalledOnce();
  });

  it('returns stored PIX when a pending payment already exists for the order', async () => {
    const user = { id: 'user-1', email: 'buyer@test.com' } as User;
    const order = {
      id: 'order-1',
      status: OrderStatus.PENDING,
      total_amount: 100,
      user,
    } as Order;
    const existingPayment = {
      id: 'payment-1',
      amount: 100,
      method: 'PIX',
      status: PaymentStatus.PENDING,
      external_id: 'gateway-1',
      pix_br_code: 'pix-code',
      pix_br_code_base64: 'base64',
      pix_expires_at: new Date('2026-06-19T13:00:00.000Z'),
      pix_amount_cents: 10_000,
    } as Payment;

    userRepositoryProvider.find.mockResolvedValue([user]);
    orderRepositoryProvider.find.mockResolvedValue([order]);
    paymentRepositoryProvider.find.mockResolvedValue([existingPayment]);

    const service = container.resolve(CreatePaymentService);
    const result = await service.execute('user-1', { order_id: 'order-1', method: 'PIX' });

    expect(result.payment.id).toBe('payment-1');
    expect(result.gatewayPayment.brCode).toBe('pix-code');
    expect(pixGatewayProvider.createPayment).not.toHaveBeenCalled();
    expect(paymentRepositoryProvider.create).not.toHaveBeenCalled();
  });

  it('throws when order belongs to another user', async () => {
    const user = { id: 'user-1', email: 'buyer@test.com' } as User;
    const order = {
      id: 'order-1',
      status: OrderStatus.PENDING,
      total_amount: 100,
      user: { id: 'other-user' } as User,
    } as Order;

    userRepositoryProvider.find.mockResolvedValue([user]);
    orderRepositoryProvider.find.mockResolvedValue([order]);

    const service = container.resolve(CreatePaymentService);

    await expect(service.execute('user-1', { order_id: 'order-1', method: 'PIX' })).rejects.toBeInstanceOf(AppError);
  });

  it('throws when order is not pending', async () => {
    const user = { id: 'user-1', email: 'buyer@test.com' } as User;
    const order = {
      id: 'order-1',
      status: OrderStatus.CONFIRMED,
      total_amount: 100,
      user,
    } as Order;

    userRepositoryProvider.find.mockResolvedValue([user]);
    orderRepositoryProvider.find.mockResolvedValue([order]);

    const service = container.resolve(CreatePaymentService);

    await expect(service.execute('user-1', { order_id: 'order-1', method: 'PIX' })).rejects.toBeInstanceOf(AppError);
  });
});
