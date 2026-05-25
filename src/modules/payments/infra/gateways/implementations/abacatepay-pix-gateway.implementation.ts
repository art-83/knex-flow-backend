import axios from 'axios';

import abacatepayConfig from '../../../../../config/abacatepay.config';
import { AbacatepayCreatePaymentResponse } from '../../../dtos/gateways/abacatepay/abacatepay-create-payment-response.dto';
import { CreatePaymentDTO } from '../../../dtos/payments/create-payment.dto';
import { IPaymentGatewayProvider } from '../providers/payment-gateway.provider';

export class AbacatepayPixGatewayImplementation implements IPaymentGatewayProvider<AbacatepayCreatePaymentResponse> {
  public async createPayment(data: CreatePaymentDTO): Promise<AbacatepayCreatePaymentResponse> {
    const requestPayload = {
      method: data.method,
      data: {
        amount: Number(data.amount),
        description: data.description,
        expiresIn: abacatepayConfig.pix.expiresIn,
        metadata: data.metadata,
      },
    };

    const { data: responseBody } = await axios.post<{ data: AbacatepayCreatePaymentResponse }>(
      `${abacatepayConfig.apiUrl}/transparents/create`,
      requestPayload,
      {
        headers: {
          Authorization: `Bearer ${abacatepayConfig.apiKey}`,
        },
      },
    );

    return responseBody.data;
  }
}

export default AbacatepayPixGatewayImplementation;
