import { PaymentStatus } from '../../enums/payment-status.enum';

export interface AbacatepayPixPaymentResponseDTO {
  data: {
    id: string;
    amount: number;
    status: PaymentStatus;
    devMode: boolean;
    barCode: string;
    url: string;
    brCode: string;
    brCodeBase64: string;
    platformFee: number;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
    metadata: {
      payment_id: string;
    };
  };
  error: string | null;
  success: {
    message: string;
  };
}
