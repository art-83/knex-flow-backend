import { PaymentMethod } from '../../../../infra/orm/enums/payment-method.enum';

interface AbacatepayCreatePaymentRequestDTO {
  order_id: string;
  amount: number;
  method: PaymentMethod;
  description: string;
  metadata: Record<string, unknown>;
}
export { AbacatepayCreatePaymentRequestDTO };
