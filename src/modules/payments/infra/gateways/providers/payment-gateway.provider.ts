import { CreatePaymentDTO } from '../../../dtos/payments/create-payment.dto';
import { CreatePaymentResponseDTO } from '../../../dtos/gateways/create-payment-response.dto';

export interface IPaymentGatewayProvider {
  createPayment(data: CreatePaymentDTO): Promise<CreatePaymentResponseDTO>;
}

export default IPaymentGatewayProvider;
