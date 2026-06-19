import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IRepositoryProvider } from '../../../../shared/infra/orm/providers/repository.provider';
import { OrderStatus } from '../../../events/infra/orm/enums/order-status.enum';
import { PaymentQueryOptionsDTO } from '../../dtos/incoming/http/payments/payment-query-options.dto';
import { Payment } from '../../infra/orm/entities/payment.entity';
import { PaymentStatus } from '../../infra/orm/enums/payment-status.enum';
import { mapStoredPixPayment } from '../../utils/map-stored-pix-payment';

@injectable()
class FindPendingPaymentByOrderService {
  constructor(
    @inject('PaymentRepositoryProvider')
    private paymentRepositoryProvider: IRepositoryProvider<Payment>,
  ) {}

  public async execute(user_id: string, order_id: string) {
    const payments = await this.paymentRepositoryProvider.find({
      order_id,
      status: PaymentStatus.PENDING,
    } as Partial<PaymentQueryOptionsDTO>);

    const payment = payments
      .filter(item => item.order.user.id === user_id && item.order.status === OrderStatus.PENDING)
      .sort((left, right) => right.created_at.getTime() - left.created_at.getTime())
      .at(0);

    if (!payment) {
      throw new AppError(404, 'Pending payment not found', 'Pagamento pendente nao encontrado.');
    }

    return {
      message: 'Pending payment found successfully.',
      ...mapStoredPixPayment(payment),
    };
  }
}
export { FindPendingPaymentByOrderService };
