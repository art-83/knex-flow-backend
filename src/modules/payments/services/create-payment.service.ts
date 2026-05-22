import { inject, injectable } from 'tsyringe';

import AppError from '../../../shared/infra/http/errors/app-error';
import IOrderRepositoryProvider from '../../events/infra/orm/repositories/providers/order-repository.provider';
import { CreatePaymentDTO } from '../dtos/payments/create-payment.dto';
import { AbacatepayCreatePaymentResponse } from '../dtos/gateways/abacatepay/abacatepay-create-payment-response.dto';
import { IPaymentGatewayProvider } from '../infra/gateways/providers/payment-gateway.provider';
import { PaymentMethod } from '../infra/orm/enums/payment-method.enum';
import { Order } from '../../events/infra/orm/entities/order.entity';
import { OrderStatus } from '../../events/infra/orm/enums/order-status.enum';

@injectable()
class CreatePaymentService {
  constructor(
    @inject('PixGatewayProvider')
    private pixGatewayProvider: IPaymentGatewayProvider<AbacatepayCreatePaymentResponse>,
    @inject('OrderRepositoryProvider')
    private orderRepositoryProvider: IOrderRepositoryProvider,
  ) {}

  public async execute(data: Partial<CreatePaymentDTO>): Promise<AbacatepayCreatePaymentResponse> {
    const order = (await this.orderRepositoryProvider.find({ id: data.order_id })).at(0);

    if (!order) {
      throw new AppError(404, 'Order not found', 'Pedido nao encontrado.');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new AppError(400, 'Order not pending', 'Pedido nao esta pendente.');
    }

    const payload = {
      ...data,
      description: this.formatDescription(order),
      amount: order.total_amount,
      metadata: {
        order_id: data.order_id,
      },
    } as CreatePaymentDTO;

    return this.pixGatewayProvider.createPayment(payload);
  }

  private formatDescription(order: Order): string {
    return `Pedido #${order.id} - ${order.user.email} - R$ ${order.total_amount.toFixed(2)}`;
  }
}

export default CreatePaymentService;
