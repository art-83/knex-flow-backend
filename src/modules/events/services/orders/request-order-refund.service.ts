import { inject, injectable } from 'tsyringe';

import { paymentsConfig } from '../../../../config/payments.config';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IRepositoryProvider } from '../../../../shared/infra/orm/providers/repository.provider';
import { OrderQueryOptionsDTO } from '../../dtos/incoming/http/order/order-query-options.dto';
import { IOrderRepositoryProvider } from '../../infra/orm/repositories/providers/order-repository.provider';
import { OrderStatus } from '../../infra/orm/enums/order-status.enum';
import { RequestRefundRequestDTO } from '../../../payments/dtos/incoming/http/orders/request-refund-request.dto';
import { PaymentQueryOptionsDTO } from '../../../payments/dtos/incoming/http/payments/payment-query-options.dto';
import { Payment } from '../../../payments/infra/orm/entities/payment.entity';
import { PaymentStatus } from '../../../payments/infra/orm/enums/payment-status.enum';
import { IPaymentGatewayProvider } from '../../../payments/infra/gateways/providers/payment-gateway.provider';
import { isRefundWindowOpen } from '../../../payments/utils/is-refund-window-open';

@injectable()
class RequestOrderRefundService {
  constructor(
    @inject('OrderRepositoryProvider')
    private orderRepositoryProvider: IOrderRepositoryProvider,
    @inject('PaymentRepositoryProvider')
    private paymentRepositoryProvider: IRepositoryProvider<Payment>,
    @inject('PixGatewayProvider')
    private pixGatewayProvider: IPaymentGatewayProvider,
  ) {}

  public async execute(userId: string, orderId: string, data: RequestRefundRequestDTO = {}) {
    const order = (
      await this.orderRepositoryProvider.find({
        id: orderId,
        user_id: userId,
      } as Partial<OrderQueryOptionsDTO>)
    ).at(0);

    if (!order) {
      throw new AppError(404, 'Order not found', 'Pedido nao encontrado.');
    }

    if (order.status === OrderStatus.REFUNDED) {
      throw new AppError(400, 'Order already refunded', 'Este pedido ja foi reembolsado.');
    }

    if (order.status === OrderStatus.DISPUTED) {
      throw new AppError(400, 'Order under dispute', 'Pedido em disputa nao pode ser reembolsado.');
    }

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new AppError(400, 'Order not refundable', 'Apenas pedidos confirmados podem ser reembolsados.');
    }

    const payment = (
      await this.paymentRepositoryProvider.find({
        order_id: orderId,
        status: PaymentStatus.PAID,
      } as Partial<PaymentQueryOptionsDTO>)
    ).at(0);

    if (!payment) {
      throw new AppError(404, 'Paid payment not found', 'Pagamento pago nao encontrado para este pedido.');
    }

    if (!payment.external_id) {
      throw new AppError(400, 'Payment missing external id', 'Pagamento sem identificador no provedor.');
    }

    const paidAt = payment.paid_at ?? payment.updated_at;

    if (!isRefundWindowOpen(paidAt, paymentsConfig.refundWindowDays)) {
      throw new AppError(
        400,
        'Refund window expired',
        `O prazo de ${paymentsConfig.refundWindowDays} dias para solicitar reembolso expirou.`,
      );
    }

    const reason = data.reason?.trim() || 'Solicitado pelo cliente';

    const gatewayRefund = await this.pixGatewayProvider.refundPayment(payment.external_id, reason);

    return {
      message: 'Refund requested successfully.',
      data: {
        order_id: order.id,
        payment_id: payment.id,
        refund_public_id: gatewayRefund.refundPublicId,
      },
    };
  }
}
export { RequestOrderRefundService };
