import { inject, injectable } from 'tsyringe';
import IRepositoryProvider from '../../../shared/infra/orm/repositories/providers/repository.provider';
import Payment from '../infra/orm/entities/payment.entity';

@injectable()
export class PaymentProcessorService {
  constructor(
    @inject('PaymentRepositoryProvider')
    private paymentRepositoryProvider: IRepositoryProvider<Payment>,
  ) {}

  public async execute(data: Payment) {
    // TODO: Implement payment processing logic
    const payment = await this.paymentRepositoryProvider.create(data);
    return { message: 'Payment created successfully.', data: payment };
  }
}
