import { AbacatepayCreatePaymentRequestDTO } from '../../../dtos/outgoing/gateways/abacatepay/create-payment-request.dto';
import { AbacatepayCreatePaymentResponseDTO } from '../../../dtos/incoming/gateways/abacatepay/create-payment-response.dto';
import { AbacatepayRefundPaymentResponseDTO } from '../../../dtos/incoming/gateways/abacatepay/refund-payment-response.dto';

interface IPaymentGatewayProvider {
  createPayment(data: AbacatepayCreatePaymentRequestDTO): Promise<AbacatepayCreatePaymentResponseDTO>;
  refundPayment(externalId: string, reason?: string): Promise<AbacatepayRefundPaymentResponseDTO>;
}
export { IPaymentGatewayProvider };
