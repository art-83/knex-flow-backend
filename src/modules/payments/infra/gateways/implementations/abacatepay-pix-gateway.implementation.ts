import abacatepayConfig from '../../../../../config/abacatepay.config';
import axios from 'axios';
import { AbacatepayCreatePixPaymentDTO } from '../../../dtos/gateways/abacatepay-create-pix-payment.dto';
import { AbacatepayPixPaymentResponseDTO } from '../../../dtos/gateways/abacatepay-pix-payment-response.dto';
import { IPaymentGatewayProvider } from '../providers/payment-gateway.provider';

export class AbacatepayPixGatewayImplementation implements IPaymentGatewayProvider<
  AbacatepayCreatePixPaymentDTO,
  AbacatepayPixPaymentResponseDTO
> {
  public async createPayment(data: AbacatepayCreatePixPaymentDTO): Promise<AbacatepayPixPaymentResponseDTO> {
    const response = await axios.post<AbacatepayPixPaymentResponseDTO>(
      `${abacatepayConfig.apiUrl}/transparents/create`,
      data,
      {
        headers: {
          Authorization: `Bearer ${abacatepayConfig.apiKey}`,
        },
      },
    );
    return response.data;
  }
}
