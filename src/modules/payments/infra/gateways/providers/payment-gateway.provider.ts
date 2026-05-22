import { CreatePaymentDTO } from '../../../dtos/payments/create-payment.dto';

export interface IPaymentGatewayProvider<T> {
  createPayment(data: CreatePaymentDTO): Promise<T>;
}

export default IPaymentGatewayProvider;
