import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IWebhookHandlerProvider } from '../../infra/gateways/providers/webhook-handler.provider';
import { inject, injectable } from 'tsyringe';
import { IOrderRepositoryProvider } from '../../../events/infra/orm/repositories/providers/order-repository.provider';
import { IRepositoryProvider } from '../../../../shared/infra/orm/providers/repository.provider';
import { Payment } from '../../infra/orm/entities/payment.entity';
import { PaymentQueryOptionsDTO } from '../../dtos/incoming/http/payments/payment-query-options.dto';
import { AbacatePayTransparentWebhookRequestDTO } from '../../dtos/incoming/webhooks/abacatepay/transparent-webhook-request.dto';

@injectable()
class AbacatepayLostWebhookHandler implements IWebhookHandlerProvider<AbacatePayTransparentWebhookRequestDTO> {
  constructor(
    @inject('OrderRepositoryProvider')
    private orderRepositoryProvider: IOrderRepositoryProvider,
    @inject('PaymentRepositoryProvider')
    private paymentRepositoryProvider: IRepositoryProvider<Payment>,
  ) {}

  public async handle(payload: AbacatePayTransparentWebhookRequestDTO): Promise<void> {
    const transparent = payload.data.transparent;
    const orderId = String(transparent.metadata.order_id);
    const externalId = String(transparent.id);

    if (!orderId || !externalId) {
      throw new AppError(400, 'Invalid payload', 'Payload invalido.');
    }

    const paymentQueryOptions = {
      order_id: orderId,
      external_id: externalId,
    } as PaymentQueryOptionsDTO;

    const payment = (await this.paymentRepositoryProvider.find(paymentQueryOptions)).at(0);

    if (!payment) {
      throw new AppError(404, 'Payment not found', 'Pagamento nao encontrado.');
    }

    await this.orderRepositoryProvider.loseDisputedOrder(orderId, payment.id);
  }
}
export { AbacatepayLostWebhookHandler };
