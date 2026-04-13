import IOrderRepositoryProvider from '../providers/order-repository.provider';
import Order from '../../entities/order.entity';
import OrderQueryOptions from '../../../../dtos/order/order-query-options';
import { Repository } from 'typeorm';
import dataSource from '../../../../../../shared/infra/orm/database';

class OrderRepository implements IOrderRepositoryProvider {
  private repository: Repository<Order>;

  constructor() {
    this.repository = dataSource.getRepository(Order);
  }

  public async find(data: Partial<OrderQueryOptions>): Promise<Order[]> {
    const query = this.repository.createQueryBuilder('order');

    if (data.id) query.andWhere('order.id = :id', { id: data.id });

    if (data.user_id) query.andWhere('order.user_id = :user_id', { user_id: data.user_id });

    if (data.status) query.andWhere('order.status = :status', { status: data.status });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: Order): Promise<Order> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Order): Promise<Order> {
    const create = this.repository.create(data);
    await this.repository.update(id, create);
    return create;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.delete(id);
    return Number(deleteResult.affected);
  }
}

export default OrderRepository;
