import { Repository } from 'typeorm';
import dataSource from '../../../../../../shared/infra/orm/database';
import EventActivityOrderQueryOptions from '../../../../dtos/event-activity-order/event-activity-order-query-options';
import EventActivityPresence from '../../entities/event-activity-presence.entity';
import IEventActivityOrderRepositoryProvider from '../providers/event-activity-order-repository.provider';

class EventActivityOrderRepository implements IEventActivityOrderRepositoryProvider {
  private repository: Repository<EventActivityPresence>;

  constructor() {
    this.repository = dataSource.getRepository(EventActivityPresence);
  }

  public async find(data: Partial<EventActivityOrderQueryOptions>): Promise<EventActivityPresence[]> {
    const query = this.repository.createQueryBuilder('event_activity_order');

    if (data.id) query.andWhere('event_activity_order.id = :id', { id: data.id });

    if (data.event_activity_id) {
      query.andWhere('event_activity_order.event_activity_id = :event_activity_id', {
        event_activity_id: data.event_activity_id,
      });
    }

    if (data.order_id) {
      query.andWhere('event_activity_order.order_id = :order_id', { order_id: data.order_id });
    }

    if (data.user_presence !== undefined) {
      query.andWhere('event_activity_order.user_presence = :user_presence', { user_presence: data.user_presence });
    }

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: Partial<EventActivityPresence>): Promise<EventActivityPresence> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Partial<EventActivityPresence>): Promise<EventActivityPresence> {
    const create = this.repository.create(data);
    await this.repository.update(id, create);
    return create;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }

  public async createMany(data: Partial<EventActivityPresence>[]): Promise<EventActivityPresence[]> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }
}

export default EventActivityOrderRepository;
