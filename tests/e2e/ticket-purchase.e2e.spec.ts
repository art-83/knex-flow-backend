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

describe('Ticket purchase E2E', () => {
  it('runs register → event → batch → publish → order → payment → webhook → confirmed order', async () => {
    const agent = getTestAgent();

    const admin = await seedAdminWithOrganization({ email: 'e2e-admin@test.com' });
    const buyerTokens = await registerAndLogin(agent, 'e2e-buyer@test.com');

    const startDate = new Date(Date.now() + 86_400_000).toISOString();
    const endDate = new Date(Date.now() + 172_800_000).toISOString();

    const eventResponse = await agent
      .post('/events')
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .send({
        name: 'E2E Conference',
        description: 'End-to-end ticket purchase flow',
        organization_id: admin.organizationId,
        start_date: startDate,
        end_date: endDate,
        modality: EventModality.ONLINE,
        url_path: 'e2e-conference',
      })
      .expect(201);

    const eventId = eventResponse.body.event.id as string;

    await agent
      .post('/events/batches')
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .send({
        event_id: eventId,
        base_quantity: 20,
        price: 120,
      })
      .expect(201);

    await agent.post(`/events/${eventId}/publish`).set('Authorization', `Bearer ${admin.accessToken}`).expect(200);

    await agent.get(`/public/events/${eventId}/availability`).expect(200);
    await agent.get('/public/events').expect(200);

    const buyerId = await getAuthenticatedUserId(agent, buyerTokens.accessToken);
    const orderId = await createPendingOrderForUser(buyerId, eventId);

    const paymentResponse = await agent
      .post('/payments')
      .set('Authorization', `Bearer ${buyerTokens.accessToken}`)
      .send({ order_id: orderId, method: 'PIX' })
      .expect(201);

    expect(paymentResponse.body.payment.external_id).toBeDefined();

    const externalId = getTestFakes().paymentGateway.payments.at(0)?.id;
    expect(externalId).toBeDefined();

    await agent
      .post('/webhook/abacatepay')
      .set('x-webhook-secret', process.env.ABACATEPAY_SECRET!)
      .send(
        buildAbacatepayWebhookPayload({
          event: 'transparent.completed',
          orderId,
          externalId: externalId!,
          status: PaymentStatus.PAID,
        }),
      )
      .expect(200);

    const ordersResponse = await agent
      .get('/orders')
      .set('Authorization', `Bearer ${buyerTokens.accessToken}`)
      .expect(200);

    const confirmedOrder = ordersResponse.body.data.find((order: { id: string }) => order.id === orderId);

    expect(confirmedOrder.status).toBe(OrderStatus.CONFIRMED);
  });
});
