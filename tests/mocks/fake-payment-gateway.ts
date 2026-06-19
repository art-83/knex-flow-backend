import { v7 as uuidv7 } from 'uuid';

import { orderConfig } from '../../src/config/order.config';
import { AbacatepayCreatePaymentRequestDTO } from '../../src/modules/payments/dtos/outgoing/gateways/abacatepay/create-payment-request.dto';
import { AbacatepayCreatePaymentResponseDTO } from '../../src/modules/payments/dtos/incoming/gateways/abacatepay/create-payment-response.dto';
import { AbacatepayRefundPaymentResponseDTO } from '../../src/modules/payments/dtos/incoming/gateways/abacatepay/refund-payment-response.dto';
import { IPaymentGatewayProvider } from '../../src/modules/payments/infra/gateways/providers/payment-gateway.provider';

class FakePaymentGateway implements IPaymentGatewayProvider {
  public payments: AbacatepayCreatePaymentResponseDTO[] = [];

  public async createPayment(data: AbacatepayCreatePaymentRequestDTO): Promise<AbacatepayCreatePaymentResponseDTO> {
    const payment: AbacatepayCreatePaymentResponseDTO = {
      id: `fake-${uuidv7()}`,
      status: 'PENDING',
      amount: data.amount,
      brCode: '00020126580014br.gov.bcb.pix',
      brCodeBase64: 'data:image/png;base64,fake',
      expiresAt: new Date(Date.now() + orderConfig.pendingTtlMinutes * 60 * 1000).toISOString(),
    };

    this.payments.push(payment);

    return payment;
  }

  public async refundPayment(externalId: string, _reason?: string): Promise<AbacatepayRefundPaymentResponseDTO> {
    return {
      id: externalId,
      status: 'REFUNDED',
    };
  }
}

export { FakePaymentGateway };
