import { describe, it, expect } from 'vitest';

import { getTestAgent } from '../helpers/test-app';
import {
  buildAbacatepayWebhookPayload,
  createPendingOrderForUser,
  registerAndLogin,
  seedAdminWithOrganization,
} from '../helpers/auth-helper';
import { createPublishedEvent } from '../helpers/event-helper';
import { getAuthenticatedUserId } from '../helpers/user-helper';
import { getTestFakes } from '../helpers/register-test-container';
import { OrderStatus } from '../../src/modules/events/infra/orm/enums/order-status.enum';
import { PaymentStatus } from '../../src/modules/payments/infra/orm/enums/payment-status.enum';

describe('Pending payment resume E2E', () => {
  it('supports leaving and resuming PIX payment until webhook confirms the order', async () => {
    const agent = getTestAgent();
    const admin = await seedAdminWithOrganization({ email: 'resume-admin@test.com' });
    const buyerTokens = await registerAndLogin(agent, 'resume-buyer@test.com');
    const eventId = await createPublishedEvent(admin.accessToken, admin.organizationId, 'resume-payment-event');
    const buyerId = await getAuthenticatedUserId(agent, buyerTokens.accessToken);
    const orderId = await createPendingOrderForUser(buyerId, eventId);

    const firstPixResponse = await agent
      .get(`/payment/by-order/${orderId}`)
      .set('Authorization', `Bearer ${buyerTokens.accessToken}`)
      .expect(200);

    const pendingOrderResponse = await agent
      .get(`/orders?id=${orderId}`)
      .set('Authorization', `Bearer ${buyerTokens.accessToken}`)
      .expect(200);

    expect(pendingOrderResponse.body.data[0].status).toBe(OrderStatus.PENDING);

    const resumedPixResponse = await agent
      .get(`/payment/by-order/${orderId}`)
      .set('Authorization', `Bearer ${buyerTokens.accessToken}`)
      .expect(200);

    expect(resumedPixResponse.body.gatewayPayment.brCode).toBeTruthy();
    expect(resumedPixResponse.body.payment.id).toBe(firstPixResponse.body.payment.id);

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

    const confirmedOrderResponse = await agent
      .get(`/orders?id=${orderId}`)
      .set('Authorization', `Bearer ${buyerTokens.accessToken}`)
      .expect(200);

    expect(confirmedOrderResponse.body.data[0].status).toBe(OrderStatus.CONFIRMED);

    const paymentStatusResponse = await agent
      .get(`/payment/${firstPixResponse.body.payment.id}`)
      .set('Authorization', `Bearer ${buyerTokens.accessToken}`)
      .expect(200);

    expect(paymentStatusResponse.body.data.status).toBe(PaymentStatus.PAID);
  });
});
