import { v7 as uuidv7 } from 'uuid';

import { TEST_USER_EMAIL } from './constants';

function buildAbacatepayWebhookPayload(options: {
  event: string;
  orderId: string;
  externalId: string;
  status: string;
}) {
  return {
    id: uuidv7(),
    event: options.event,
    apiVersion: 1,
    devMode: true,
    data: {
      transparent: {
        id: options.externalId,
        externalId: null,
        amount: 10000,
        paidAmount: 10000,
        platformFee: 0,
        status: options.status,
        items: [],
        methods: [],
        frequency: 'ONE_TIME',
        coupons: [],
        devMode: true,
        customerId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        receiptUrl: null,
        metadata: {
          order_id: options.orderId,
        },
      },
      customer: {
        id: uuidv7(),
        name: 'Test User',
        email: TEST_USER_EMAIL,
        taxId: null,
      },
      payerInformation: {
        method: 'PIX',
        utms: {
          source: null,
          medium: null,
          campaign: null,
          term: null,
          content: null,
        },
        PIX: {
          name: 'Test User',
          taxId: null,
          isSameAsCustomer: true,
        },
      },
    },
  };
}

export { buildAbacatepayWebhookPayload };
