import { AbacatepayCreatePaymentResponseDTO } from '../dtos/incoming/gateways/abacatepay/create-payment-response.dto';
import { Payment } from '../infra/orm/entities/payment.entity';

interface PixPaymentResponse {
  payment: {
    id: string;
    amount: number | string;
    method: string;
    status: string;
  };
  gatewayPayment: AbacatepayCreatePaymentResponseDTO;
}

function mapStoredPixPayment(payment: Payment): PixPaymentResponse {
  if (!payment.pix_br_code || !payment.pix_br_code_base64 || !payment.pix_expires_at) {
    throw new Error('Payment is missing stored PIX data.');
  }

  return {
    payment: {
      id: payment.id,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
    },
    gatewayPayment: {
      id: payment.external_id,
      status: 'PENDING',
      amount: payment.pix_amount_cents ?? Math.round(Number(payment.amount) * 100),
      brCode: payment.pix_br_code,
      brCodeBase64: payment.pix_br_code_base64,
      expiresAt: payment.pix_expires_at.toISOString(),
    },
  };
}
export { PixPaymentResponse, mapStoredPixPayment };
