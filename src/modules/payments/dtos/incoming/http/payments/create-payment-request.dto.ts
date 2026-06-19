import { PaymentMethod } from '../../../../infra/orm/enums/payment-method.enum';

interface CreatePaymentRequestDTO {
  order_id: string;
  method: PaymentMethod;
}
export { CreatePaymentRequestDTO };
