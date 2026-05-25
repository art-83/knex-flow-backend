import { PaymentStatus } from '../../../infra/orm/enums/payment-status.enum';

export interface AbacatePayPixWebhookResponseDTO {
  event: string;
  devMode: boolean;
  data: {
    id: string;
    externalId: string;
    amount: number;
    paidAmount: number;
    platformFee: number;
    status: PaymentStatus;
    brCode: string;
    brCodeBase64: string;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    metadata: {
      order_id: string;
    };
  };
}

export default AbacatePayPixWebhookResponseDTO;
