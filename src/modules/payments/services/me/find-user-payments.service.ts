import { inject, injectable } from 'tsyringe';

import { IRepositoryProvider } from '../../../../shared/infra/orm/providers/repository.provider';
import { PaymentQueryOptions } from '../../dtos/payments/payment-query-options.dto';
import { Payment } from '../../infra/orm/entities/payment.entity';
import { AppError } from '../../../../shared/infra/http/errors/app-error';

@injectable()
class FindUserPaymentsService {
  constructor(
    @inject('PaymentRepositoryProvider')
    private paymentRepositoryProvider: IRepositoryProvider<Payment>,
  ) {}

  public async execute(user_id: string, options: Partial<PaymentQueryOptions>) {
    const payments = (
      await this.paymentRepositoryProvider.find({
        id: options.id,
      } as Partial<PaymentQueryOptions>)
    ).at(0);

    if (!payments) {
      throw new AppError(404, 'Payment not found', 'Pagamento nao encontrado.');
    }

    if (payments.order.user.id !== user_id) {
      throw new AppError(403, 'User does not match payment user', 'Usuario nao corresponde ao usuario do pagamento.');
    }

    const response = {
      id: payments.id,
      amount: payments.amount,
      method: payments.method,
      status: payments.status,
      created_at: payments.created_at,
      updated_at: payments.updated_at,
    };

    return {
      message: 'Payments found successfully.',
      data: response,
    };
  }
}
export { FindUserPaymentsService };
