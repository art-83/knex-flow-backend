import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';
import { EventActivityPresenceQueryOptions } from '../../../../dtos/event-activity-presence/event-activity-presence-query-options';
import { EventActivityPresence } from '../../entities/event-activity-presence.entity';
import { IEventActivityPresenceRepositoryProvider } from '../providers/event-activity-presence-repository.provider';

class EventActivityPresenceRepository implements IEventActivityPresenceRepositoryProvider {
  private repository: Repository<EventActivityPresence>;

  constructor() {
    this.repository = dataSource.getRepository(EventActivityPresence);
  }

  public async find(data: Partial<EventActivityPresenceQueryOptions>): Promise<EventActivityPresence[]> {
    const query = this.repository.createQueryBuilder('event_activity_presence');

    query.leftJoinAndSelect('event_activity_presence.user', 'user');
    query.leftJoinAndSelect('event_activity_presence.event_activity', 'event_activity');

    if (data.id) query.andWhere('event_activity_presence.id = :id', { id: data.id });

    if (data.event_activity_id) {
      query.andWhere('event_activity_presence.event_activity_id = :event_activity_id', {
        event_activity_id: data.event_activity_id,
      });
    }

    if (data.user_id) {
      query.andWhere('event_activity_presence.user_id = :user_id', { user_id: data.user_id });
    }

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async countByEventActivity(event_activity_id: string): Promise<number> {
    return this.repository.count({ where: { event_activity: { id: event_activity_id } } });
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
}
export { EventActivityPresenceRepository };
