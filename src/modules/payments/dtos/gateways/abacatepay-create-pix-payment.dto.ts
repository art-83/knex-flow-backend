import { PaymentMethod } from '../../infra/orm/enums/payment-method.enum';

export interface AbacatepayCreatePixPaymentDTO {
  method: PaymentMethod;
  amount: number;
}
