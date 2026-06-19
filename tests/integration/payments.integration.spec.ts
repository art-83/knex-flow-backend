import { describe, it, expect } from 'vitest';

import { getTestAgent } from '../helpers/test-app';
import {
  buildAbacatepayWebhookPayload,
  createPendingOrderForUser,
  registerAndLogin,
  seedAdminWithOrganization,
} from '../helpers/auth-helper';
import { getAuthenticatedUserId } from '../helpers/user-helper';
import { getTestFakes } from '../helpers/register-test-container';
import { EventModality } from '../../src/modules/events/infra/orm/enums/event-modality.enum';
import { PaymentStatus } from '../../src/modules/payments/infra/orm/enums/payment-status.enum';
import { OrderStatus } from '../../src/modules/events/infra/orm/enums/order-status.enum';

async function createPublishedEvent(accessToken: string, organizationId: string, slug: string) {
  const agent = getTestAgent();
  const startDate = new Date(Date.now() + 86_400_000).toISOString();
  const endDate = new Date(Date.now() + 172_800_000).toISOString();

  const createResponse = await agent
    .post('/events')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name: 'Payment Event',
      description: 'Event for payment tests',
      organization_id: organizationId,
      start_date: startDate,
      end_date: endDate,
      modality: EventModality.ONLINE,
      url_path: slug,
    })
    .expect(201);

  const eventId = createResponse.body.event.id as string;

  await agent
    .post('/events/batches')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      event_id: eventId,
      base_quantity: 5,
      price: 75,
    })
    .expect(201);

  await agent.post(`/events/${eventId}/publish`).set('Authorization', `Bearer ${accessToken}`).expect(200);

  return eventId;
}

describe('Payments integration', () => {
  it('creates payment for pending order using fake gateway', async () => {
    const agent = getTestAgent();
    const admin = await seedAdminWithOrganization();
    const buyer = await registerAndLogin(agent, 'payments-buyer@test.com');
    const eventId = await createPublishedEvent(admin.accessToken, admin.organizationId, 'payment-event');
    const buyerId = await getAuthenticatedUserId(agent, buyer.accessToken);
    const orderId = await createPendingOrderForUser(buyerId, eventId);

    const paymentResponse = await agent
      .post('/payments')
      .set('Authorization', `Bearer ${buyer.accessToken}`)
      .send({ order_id: orderId, method: 'PIX' })
      .expect(201);

    expect(paymentResponse.body.payment.id).toBeDefined();
    expect(getTestFakes().paymentGateway.payments.length).toBe(1);
  });
});

describe('Webhook integration', () => {
  it('confirms order when abacatepay completed webhook is received', async () => {
    const agent = getTestAgent();
    const admin = await seedAdminWithOrganization();
    const buyer = await registerAndLogin(agent, 'webhook-buyer@test.com');
    const eventId = await createPublishedEvent(admin.accessToken, admin.organizationId, 'webhook-event');
    const buyerId = await getAuthenticatedUserId(agent, buyer.accessToken);
    const orderId = await createPendingOrderForUser(buyerId, eventId);

    await agent
      .post('/payments')
      .set('Authorization', `Bearer ${buyer.accessToken}`)
      .send({ order_id: orderId, method: 'PIX' })
      .expect(201);

    const externalId = getTestFakes().paymentGateway.payments.at(0)?.id;
    expect(externalId).toBeDefined();

    const payload = buildAbacatepayWebhookPayload({
      event: 'transparent.completed',
      orderId,
      externalId: externalId!,
      status: PaymentStatus.PAID,
    });

    await agent
      .post('/webhook/abacatepay')
      .set('x-webhook-secret', process.env.ABACATEPAY_SECRET!)
      .send(payload)
      .expect(200);

    const ordersResponse = await agent.get('/orders').set('Authorization', `Bearer ${buyer.accessToken}`).expect(200);

    const order = ordersResponse.body.data.find((item: { id: string }) => item.id === orderId);

    expect(order.status).toBe(OrderStatus.CONFIRMED);
  });
});

describe('Orders integration', () => {
  it('lists authenticated user orders', async () => {
    const agent = getTestAgent();
    const admin = await seedAdminWithOrganization();
    const buyer = await registerAndLogin(agent, 'orders-buyer@test.com');
    const eventId = await createPublishedEvent(admin.accessToken, admin.organizationId, 'orders-event');
    const buyerId = await getAuthenticatedUserId(agent, buyer.accessToken);

    await createPendingOrderForUser(buyerId, eventId);

    const ordersResponse = await agent.get('/orders').set('Authorization', `Bearer ${buyer.accessToken}`).expect(200);

    expect(ordersResponse.body.data.length).toBeGreaterThan(0);
  });
});
