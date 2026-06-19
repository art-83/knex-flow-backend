import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IOrderRepositoryProvider } from '../../../events/infra/orm/repositories/providers/order-repository.provider';
import { CreatePaymentRequestDTO } from '../../dtos/incoming/http/payments/create-payment-request.dto';
import { AbacatepayCreatePaymentRequestDTO } from '../../dtos/outgoing/gateways/abacatepay/create-payment-request.dto';
import { IPaymentGatewayProvider } from '../../infra/gateways/providers/payment-gateway.provider';
import { Order } from '../../../events/infra/orm/entities/order.entity';
import { OrderStatus } from '../../../events/infra/orm/enums/order-status.enum';
import { IUserRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-repository.provider';
import { User } from '../../../users/infra/orm/entities/user.entity';
import { PaymentStatus } from '../../infra/orm/enums/payment-status.enum';
import { IRepositoryProvider } from '../../../../shared/infra/orm/providers/repository.provider';
import { Payment } from '../../infra/orm/entities/payment.entity';
import { payAbacatepayPix } from '../../utils/dev-pay-abacatepay-pix';

@injectable()
class CreatePaymentService {
  constructor(
    @inject('PixGatewayProvider')
    private pixGatewayProvider: IPaymentGatewayProvider,
    @inject('OrderRepositoryProvider')
    private orderRepositoryProvider: IOrderRepositoryProvider,
    @inject('UserRepositoryProvider')
    private userRepositoryProvider: IUserRepositoryProvider,
    @inject('PaymentRepositoryProvider')
    private paymentRepositoryProvider: IRepositoryProvider<Payment>,
  ) {}

  public async execute(user_id: string, data: Partial<CreatePaymentRequestDTO>) {
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

    const payload: AbacatepayCreatePaymentRequestDTO = {
      order_id: data.order_id!,
      method: data.method!,
      description: this.formatDescription(user, order),
      amount: Number(order.total_amount),
      metadata: {
        order_id: data.order_id!,
      },
    };

    const gatewayPayment = await this.pixGatewayProvider.createPayment(payload);

    const payment = await this.paymentRepositoryProvider.create({
      order: order,
      amount: order.total_amount,
      method: data.method,
      status: PaymentStatus.PENDING,
      provider: 'abacatepay',
      external_id: gatewayPayment.id,
    });

    if (process.env.ENVIRONMENT === 'development') {
      await payAbacatepayPix(gatewayPayment.id);
    }

    return {
      payment,
      gatewayPayment,
    };
  }

  private formatDescription(user: User, order: Order): string {
    const convertedAmount = Number(order.total_amount).toFixed(2);
    return `Pedido #${order.id} - ${user.email} - R$ ${convertedAmount}`;
  }
}
export { CreatePaymentService };
