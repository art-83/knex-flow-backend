import AppError from '../../../../shared/infra/http/errors/app-error';
import { IWebhookHandlerProvider } from '../../infra/gateways/providers/webhook-handler.provider';
import { inject } from 'tsyringe';
import IOrderRepositoryProvider from '../../../events/infra/orm/repositories/providers/order-repository.provider';

class AbacatepayCompletedWebhookHandler implements IWebhookHandlerProvider {
  constructor(
    @inject('OrderRepositoryProvider')
    private orderRepositoryProvider: IOrderRepositoryProvider,
  ) {}

  public async handle(payload: any): Promise<void> {
    if (!payload || !payload.metadata || !payload.metadata.order_id) {
      throw new AppError(400, 'Invalid payload', 'Payload invalido.');
    }

    const order_id = payload.metadata.order_id;

    const order = await this.orderRepositoryProvider.find({ id: order_id });

    if (!order) {
      throw new AppError(404, 'Order not found', 'Pedido nao encontrado.');
    }
  }
}

export default AbacatepayCompletedWebhookHandler;
