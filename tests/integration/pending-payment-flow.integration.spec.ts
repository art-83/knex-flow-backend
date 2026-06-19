import { describe, it, expect } from 'vitest';
import { container } from 'tsyringe';

import { getTestAgent } from '../helpers/test-app';
import { createPendingOrderForUser, registerAndLogin, seedAdminWithOrganization } from '../helpers/auth-helper';
import { createPublishedEvent } from '../helpers/event-helper';
import { getAuthenticatedUserId } from '../helpers/user-helper';
import { getTestFakes } from '../helpers/register-test-container';
import { dataSource } from '../../src/shared/infra/orm/database';
import { Order } from '../../src/modules/events/infra/orm/entities/order.entity';
import { ExpirePendingOrdersService } from '../../src/modules/events/services/orders/expire-pending-orders.service';
import { OrderStatus } from '../../src/modules/events/infra/orm/enums/order-status.enum';
import { PaymentStatus } from '../../src/modules/payments/infra/orm/enums/payment-status.enum';
import { orderConfig } from '../../src/config/order.config';

describe('Pending payment flow integration', () => {
  it('exposes pending order TTL on public availability', async () => {
    const agent = getTestAgent();
    const admin = await seedAdminWithOrganization();
    const eventId = await createPublishedEvent(admin.accessToken, admin.organizationId, 'pending-ttl-event');

    const availabilityResponse = await agent.get(`/public/events/${eventId}/availability`).expect(200);

    expect(availabilityResponse.body.data.pending_order_ttl_minutes).toBe(orderConfig.pendingTtlMinutes);
  });

  it('returns PIX payload needed by the payment screen', async () => {
    const agent = getTestAgent();
    const admin = await seedAdminWithOrganization();
    const buyer = await registerAndLogin(agent, 'pix-payload-buyer@test.com');
    const eventId = await createPublishedEvent(admin.accessToken, admin.organizationId, 'pix-payload-event');
    const buyerId = await getAuthenticatedUserId(agent, buyer.accessToken);
    const orderId = await createPendingOrderForUser(buyerId, eventId);

    const paymentResponse = await agent
      .get(`/payment/by-order/${orderId}`)
      .set('Authorization', `Bearer ${buyer.accessToken}`)
      .expect(200);

    expect(paymentResponse.body.payment.status).toBe(PaymentStatus.PENDING);
    expect(paymentResponse.body.gatewayPayment.brCode).toBeTruthy();
    expect(paymentResponse.body.gatewayPayment.brCodeBase64).toBeTruthy();
    expect(paymentResponse.body.gatewayPayment.amount).toBeGreaterThan(0);
    expect(paymentResponse.body.gatewayPayment.expiresAt).toBeTruthy();
    expect(getTestFakes().paymentGateway.payments).toHaveLength(1);
  });

  it('allows resuming a pending order without creating a new PIX', async () => {
    const agent = getTestAgent();
    const admin = await seedAdminWithOrganization();
    const buyer = await registerAndLogin(agent, 'resume-pix-buyer@test.com');
    const eventId = await createPublishedEvent(admin.accessToken, admin.organizationId, 'resume-pix-event');
    const buyerId = await getAuthenticatedUserId(agent, buyer.accessToken);
    const orderId = await createPendingOrderForUser(buyerId, eventId);

    const firstPaymentResponse = await agent
      .get(`/payment/by-order/${orderId}`)
      .set('Authorization', `Bearer ${buyer.accessToken}`)
      .expect(200);

    const orderResponse = await agent
      .get(`/orders?id=${orderId}`)
      .set('Authorization', `Bearer ${buyer.accessToken}`)
      .expect(200);

    expect(orderResponse.body.data).toHaveLength(1);
    expect(orderResponse.body.data[0].status).toBe(OrderStatus.PENDING);
    expect(orderResponse.body.data[0].event?.id).toBe(eventId);

    const paymentStatusResponse = await agent
      .get(`/payment/${firstPaymentResponse.body.payment.id}`)
      .set('Authorization', `Bearer ${buyer.accessToken}`)
      .expect(200);

    expect(paymentStatusResponse.body.data.status).toBe(PaymentStatus.PENDING);

    const secondPaymentResponse = await agent
      .get(`/payment/by-order/${orderId}`)
      .set('Authorization', `Bearer ${buyer.accessToken}`)
      .expect(200);

    expect(secondPaymentResponse.body.payment.id).toBe(firstPaymentResponse.body.payment.id);
    expect(getTestFakes().paymentGateway.payments).toHaveLength(1);
  });

  it('expires stale pending orders through the worker service', async () => {
    const agent = getTestAgent();
    const admin = await seedAdminWithOrganization();
    const buyer = await registerAndLogin(agent, 'expire-order-buyer@test.com');
    const eventId = await createPublishedEvent(admin.accessToken, admin.organizationId, 'expire-order-event');
    const buyerId = await getAuthenticatedUserId(agent, buyer.accessToken);
    const orderId = await createPendingOrderForUser(buyerId, eventId);

    const staleCreatedAt = new Date(Date.now() - (orderConfig.pendingTtlMinutes + 1) * 60 * 1000);
    await dataSource.getRepository(Order).update(orderId, { created_at: staleCreatedAt });

    const expireService = container.resolve(ExpirePendingOrdersService);
    const result = await expireService.execute();

    expect(result.expired_count).toBe(1);

    const ordersResponse = await agent
      .get(`/orders?id=${orderId}`)
      .set('Authorization', `Bearer ${buyer.accessToken}`)
      .expect(200);

    expect(ordersResponse.body.data[0].status).toBe(OrderStatus.EXPIRED);

    await agent
      .post('/payments')
      .set('Authorization', `Bearer ${buyer.accessToken}`)
      .send({ order_id: orderId, method: 'PIX' })
      .expect(400);
  });
});
