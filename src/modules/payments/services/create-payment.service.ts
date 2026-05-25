import { inject, injectable } from 'tsyringe';

import AppError from '../../../shared/infra/http/errors/app-error';
import IOrderRepositoryProvider from '../../events/infra/orm/repositories/providers/order-repository.provider';
import { CreatePaymentDTO } from '../dtos/payments/create-payment.dto';
import { AbacatepayCreatePaymentResponse } from '../dtos/gateways/abacatepay/abacatepay-create-payment-response.dto';
import { IPaymentGatewayProvider } from '../infra/gateways/providers/payment-gateway.provider';
import { Order } from '../../events/infra/orm/entities/order.entity';
import { OrderStatus } from '../../events/infra/orm/enums/order-status.enum';
import IUserRepositoryProvider from '../../users/infra/orm/repositories/providers/user-repository.provider';
import User from '../../users/infra/orm/entities/user.entity';

@injectable()
class CreatePaymentService {
  constructor(
    @inject('PixGatewayProvider')
    private pixGatewayProvider: IPaymentGatewayProvider<AbacatepayCreatePaymentResponse>,
    @inject('OrderRepositoryProvider')
    private orderRepositoryProvider: IOrderRepositoryProvider,
    @inject('UserRepositoryProvider')
    private userRepositoryProvider: IUserRepositoryProvider,
  ) {}

  public async execute(user_id: string, data: Partial<CreatePaymentDTO>): Promise<AbacatepayCreatePaymentResponse> {
    const [user, order] = await Promise.all([
      (await this.userRepositoryProvider.find({ id: user_id })).at(0),
      (await this.orderRepositoryProvider.find({ id: data.order_id })).at(0),
    ]);

    if (!user) {
      throw new AppError(404, 'User not found', 'Usuario nao encontrado.');
    }

    if (!order) {
      throw new AppError(404, 'Order not found', 'Pedido nao encontrado.');
    }

    if (user.id !== order.user.id) {
      throw new AppError(400, 'User does not match order user', 'Usuario nao corresponde ao usuario do pedido.');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new AppError(400, 'Order not pending', 'Pedido nao esta pendente.');
    }

    const payload = {
      ...data,
      description: this.formatDescription(user, order),
      amount: order.total_amount,
      metadata: {
        order_id: data.order_id,
      },
    } as CreatePaymentDTO;

    return this.pixGatewayProvider.createPayment(payload);
  }

  private formatDescription(user: User, order: Order): string {
    const convertedAmount = Number(order.total_amount).toFixed(2);
    return `Pedido #${order.id} - ${user.email} - R$ ${convertedAmount}`;
  }
}

export default CreatePaymentService;
