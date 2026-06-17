import { PaymentStatus } from '../../../infra/orm/enums/payment-status.enum';

interface AbacatePayPixWebhookRequestDTO {
  id: string;
  event: string;
  apiVersion: number;
  devMode: boolean;
  data: {
    transparent: {
      id: string;
      externalId: string | null;
      amount: number;
      paidAmount: number | null;
      platformFee: number;
      status: PaymentStatus;
      items: unknown[];
      methods: unknown[];
      frequency: 'ONE_TIME';
      coupons: unknown[];
      devMode: boolean;
      customerId: string | null;
      createdAt: string;
      updatedAt: string;
      receiptUrl: string | null;
      metadata: {
        order_id: string;
      };
    };
    customer: {
      id: string;
      name: string | null;
      email: string | null;
      taxId: string | null;
    };
    payerInformation: {
      method: string;
      utms: {
        source: string | null;
        medium: string | null;
        campaign: string | null;
        term: string | null;
        content: string | null;
      };
      PIX?: {
        name: string | null;
        taxId: string | null;
        isSameAsCustomer: boolean;
      };
    };
  };
}
export { AbacatePayPixWebhookRequestDTO };
