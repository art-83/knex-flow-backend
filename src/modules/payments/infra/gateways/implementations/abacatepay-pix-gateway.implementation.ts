import axios from 'axios';

import { abacatepayConfig } from '../../../../../config/abacatepay.config';
import { CreatePaymentResponseDTO } from '../../../dtos/gateways/create-payment-response.dto';
import { CreatePaymentDTO } from '../../../dtos/payments/create-payment.dto';
import { IPaymentGatewayProvider } from '../providers/payment-gateway.provider';
import { toCents } from '../../../utils/money-parser';

class AbacatepayPixGatewayImplementation implements IPaymentGatewayProvider {
  public async createPayment(data: CreatePaymentDTO): Promise<CreatePaymentResponseDTO> {
    const requestPayload = {
      method: data.method,
      data: {
        amount: toCents(data.amount),
        description: data.description,
        expiresIn: abacatepayConfig.pix.expiresIn,
        metadata: data.metadata,
      },
    };

    const abacatepayResponse = await axios.post(`${abacatepayConfig.apiUrl}/transparents/create`, requestPayload, {
      headers: {
        Authorization: `Bearer ${abacatepayConfig.apiKey}`,
      },
    });

    const responseBody = abacatepayResponse.data;

    const response: CreatePaymentResponseDTO = {
      id: responseBody.data.id,
      status: responseBody.data.status,
      amount: responseBody.data.amount,
      brCode: responseBody.data.brCode,
      brCodeBase64: responseBody.data.brCodeBase64,
      expiresAt: responseBody.data.expiresAt,
    };

    return response;
  }
}
export { AbacatepayPixGatewayImplementation };
