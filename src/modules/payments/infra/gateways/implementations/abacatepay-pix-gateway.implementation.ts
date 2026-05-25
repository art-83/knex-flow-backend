import axios from 'axios';

import abacatepayConfig from '../../../../../config/abacatepay.config';
import { AbacatepayCreatePaymentResponse } from '../../../dtos/gateways/abacatepay/abacatepay-create-payment-response.dto';
import { CreatePaymentDTO } from '../../../dtos/payments/create-payment.dto';
import { IPaymentGatewayProvider } from '../providers/payment-gateway.provider';
import { toCents } from '../../../utils/money-parser';

export class AbacatepayPixGatewayImplementation implements IPaymentGatewayProvider<AbacatepayCreatePaymentResponse> {
  public async createPayment(data: CreatePaymentDTO): Promise<AbacatepayCreatePaymentResponse> {
    const requestPayload = {
      method: data.method,
      data: {
        amount: toCents(data.amount),
        description: data.description,
        expiresIn: abacatepayConfig.pix.expiresIn,
        metadata: data.metadata,
      },
    };

    const abacatepayResponse = await axios.post<{ data: AbacatepayCreatePaymentResponse }>(
      `${abacatepayConfig.apiUrl}/transparents/create`,
      requestPayload,
      {
        headers: {
          Authorization: `Bearer ${abacatepayConfig.apiKey}`,
        },
      },
    );

    const responseBody = abacatepayResponse.data;

    const response: AbacatepayCreatePaymentResponse = {
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

export default AbacatepayPixGatewayImplementation;
