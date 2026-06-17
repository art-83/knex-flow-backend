import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IWebhookHandlerProvider } from '../../infra/gateways/providers/webhook-handler.provider';
import { inject, injectable } from 'tsyringe';
import { IOrderRepositoryProvider } from '../../../events/infra/orm/repositories/providers/order-repository.provider';
import { IRepositoryProvider } from '../../../../shared/infra/orm/providers/repository.provider';
import { Payment } from '../../infra/orm/entities/payment.entity';
import { PaymentStatus } from '../../infra/orm/enums/payment-status.enum';
import { OrderStatus } from '../../../events/infra/orm/enums/order-status.enum';
import { PaymentQueryOptions } from '../../dtos/payments/payment-query-options.dto';
import { AbacatePayPixWebhookRequestDTO } from '../../dtos/gateways/abacatepay/abacatepay-pix-webhook-request.dto';

@injectable()
class AbacatepayCompletedWebhookHandler implements IWebhookHandlerProvider<AbacatePayPixWebhookRequestDTO> {
  constructor(
    @inject('OrderRepositoryProvider')
    private orderRepositoryProvider: IOrderRepositoryProvider,
    @inject('PaymentRepositoryProvider')
    private paymentRepositoryProvider: IRepositoryProvider<Payment>,
  ) {}

  public async handle(payload: AbacatePayPixWebhookRequestDTO): Promise<void> {
    const transparent = payload.data.transparent;
    const orderId = String(transparent.metadata.order_id);
    const externalId = String(transparent.id);

    if (!orderId || !externalId || transparent.status !== PaymentStatus.PAID) {
      throw new AppError(400, 'Invalid payload', 'Payload invalido.');
    }

    const order = (await this.orderRepositoryProvider.find({ id: orderId })).at(0);

    if (!order) {
      throw new AppError(404, 'Order not found', 'Pedido nao encontrado.');
    }

    const paymentQueryOptions = {
      order_id: orderId,
      external_id: externalId,
    } as PaymentQueryOptions;

    const payment = (await this.paymentRepositoryProvider.find(paymentQueryOptions)).at(0);

    if (!payment) {
      throw new AppError(404, 'Payment not found', 'Pagamento nao encontrado.');
    }

    if (payment.status !== PaymentStatus.PAID) {
      await this.paymentRepositoryProvider.update(payment.id, {
        status: PaymentStatus.PAID,
      });
    }

    if (order.status === OrderStatus.PENDING) {
      await this.orderRepositoryProvider.update(order.id, {
        status: OrderStatus.CONFIRMED,
      });
    }
  }
}
export { AbacatepayCompletedWebhookHandler };
