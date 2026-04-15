import Payment from '../../entities/payment.entity';
import { Repository } from 'typeorm';
import dataSource from '../../../../../../shared/infra/orm/database';
import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import { CreateOrUpdatePaymentsDTO } from '../../../../dtos/payments/create-or-update-payment.dto';
import { PaymentQueryOptions } from '../../../../dtos/payments/payment-query-options.dto';

export class PaymentRepository implements IRepositoryProvider<Payment> {
  private repository: Repository<Payment>;

  constructor() {
    this.repository = dataSource.getRepository(Payment);
  }

  public async create(data: CreateOrUpdatePaymentsDTO): Promise<Payment> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async find(options: PaymentQueryOptions): Promise<Payment[]> {
    const query = this.repository.createQueryBuilder('payment');

    if (options.id) query.andWhere('payment.id = :id', { id: options.id });
    if (options.amount) query.andWhere('payment.amount = :amount', { amount: options.amount });
    if (options.status) query.andWhere('payment.status = :status', { status: options.status });
    if (options.created_at) query.andWhere('payment.created_at = :created_at', { created_at: options.created_at });
    if (options.updated_at) query.andWhere('payment.updated_at = :updated_at', { updated_at: options.updated_at });

    if (options.order_id) query.andWhere('payment.order_id = :order_id', { order_id: options.order_id });

    if (options.limit) query.limit(options.limit);
    if (options.offset) query.offset(options.offset);
    if (options.start_date) query.andWhere('payment.created_at >= :start_date', { start_date: options.start_date });
    if (options.end_date) query.andWhere('payment.created_at <= :end_date', { end_date: options.end_date });

    return await query.getMany();
  }

  public async update(id: string, data: CreateOrUpdatePaymentsDTO): Promise<Payment> {
    const create = this.repository.create(data);
    await this.repository.update(id, create);
    return create;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.delete(id);
    return Number(deleteResult.affected);
  }
}
