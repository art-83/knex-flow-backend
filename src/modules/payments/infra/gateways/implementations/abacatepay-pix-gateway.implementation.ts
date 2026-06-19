import axios from 'axios';

import { abacatepayConfig } from '../../../../../config/abacatepay.config';
import { AbacatepayCreatePaymentResponseDTO } from '../../../dtos/incoming/gateways/abacatepay/create-payment-response.dto';
import { AbacatepayRefundPaymentResponseDTO } from '../../../dtos/incoming/gateways/abacatepay/refund-payment-response.dto';
import { AbacatepayCreatePaymentRequestDTO } from '../../../dtos/outgoing/gateways/abacatepay/create-payment-request.dto';
import { IPaymentGatewayProvider } from '../providers/payment-gateway.provider';
import { toCents } from '../../../utils/money-parser';
import { AppError } from '../../../../../shared/infra/http/errors/app-error';

const ABACATEPAY_REFUND_ERROR_MESSAGES: Record<string, string> = {
  LOCK_NOT_ACQUIRED: 'Outra operacao de reembolso esta em andamento. Tente novamente em instantes.',
  TRANSACTION_NOT_FOUND: 'Transacao de pagamento nao encontrada no provedor.',
  TRANSACTION_NOT_REFUNDABLE: 'Este pagamento nao pode ser reembolsado no momento.',
  TRANSACTION_UNDER_DISPUTE: 'Pagamento em disputa nao pode ser reembolsado.',
  INVALID_METHOD: 'Metodo de pagamento nao suporta reembolso.',
  INSUFFICIENT_FUNDS: 'Saldo insuficiente para processar o reembolso.',
  STORE_NOT_FOUND: 'Loja de pagamento nao encontrada.',
  REFUND_REQUEST_FAILED: 'Falha ao solicitar reembolso no provedor.',
  REFUND_CONFIRMATION_FAILED: 'Falha ao confirmar reembolso no provedor.',
};

class AbacatepayPixGatewayImplementation implements IPaymentGatewayProvider {
  public async createPayment(data: AbacatepayCreatePaymentRequestDTO): Promise<AbacatepayCreatePaymentResponseDTO> {
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

    const response: AbacatepayCreatePaymentResponseDTO = {
      id: responseBody.data.id,
      status: responseBody.data.status,
      amount: responseBody.data.amount,
      brCode: responseBody.data.brCode,
      brCodeBase64: responseBody.data.brCodeBase64,
      expiresAt: responseBody.data.expiresAt,
    };

    return response;
  }

  public async refundPayment(externalId: string, reason?: string): Promise<AbacatepayRefundPaymentResponseDTO> {
    const requestPayload: { id: string; reason?: string } = { id: externalId };

    if (reason) {
      requestPayload.reason = reason;
    }

    const abacatepayResponse = await axios.post(`${abacatepayConfig.apiUrl}/transparents/refund`, requestPayload, {
      headers: {
        Authorization: `Bearer ${abacatepayConfig.apiKey}`,
      },
    });

    const responseBody = abacatepayResponse.data;

    if (!responseBody.success) {
      const errorCode = String(responseBody.error ?? 'REFUND_REQUEST_FAILED');
      const formattedMessage = ABACATEPAY_REFUND_ERROR_MESSAGES[errorCode] ?? 'Nao foi possivel solicitar o reembolso.';
      throw new AppError(400, errorCode, formattedMessage);
    }

    return {
      refundPublicId: responseBody.data.refundPublicId,
    };
  }
}
export { AbacatepayPixGatewayImplementation };
