import { PaymentMethod } from '../../infra/orm/enums/payment-method.enum';

interface CreatePaymentDTO {
  order_id: string;

  amount: number;
  method: PaymentMethod;
  description: string;

  customer_name: string;
  customer_email: string;
  customer_document: string;
  customer_phone: string;

  card_number: string;
  card_holder_name: string;
  card_expiration_month: string;
  card_expiration_year: string;
  card_cvv: string;
  card_installments: number;

  pix_expires_in: number;

  metadata: Record<string, unknown>;
}
export { CreatePaymentDTO };
