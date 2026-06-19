import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';
import { EventActivityInvitedQueryOptions } from '../../../../dtos/event-activity-invited/event-activity-invited-query-options';
import { EventActivityInvited } from '../../entities/event-activity-invited.entity';
import { IEventActivityInvitedRepositoryProvider } from '../providers/event-activity-invited-repository.provider';

class EventActivityInvitedRepository implements IEventActivityInvitedRepositoryProvider {
  private repository: Repository<EventActivityInvited>;

  constructor() {
    this.repository = dataSource.getRepository(EventActivityInvited);
  }

  public async find(data: Partial<EventActivityInvitedQueryOptions>): Promise<EventActivityInvited[]> {
    const query = this.repository.createQueryBuilder('event_activity_invited');

    query.leftJoinAndSelect('event_activity_invited.event_activity', 'event_activity');
    query.leftJoinAndSelect('event_activity.event', 'event');
    query.leftJoinAndSelect('event_activity_invited.user', 'user');
    query.leftJoinAndSelect('event_activity_invited.file', 'file');

    if (data.id) query.andWhere('event_activity_invited.id = :id', { id: data.id });

    if (data.event_id) query.andWhere('event_activity.event_id = :event_id', { event_id: data.event_id });

    if (data.name) query.andWhere('event_activity_invited.name = :name', { name: data.name });

    if (data.institution) {
      query.andWhere('event_activity_invited.institution = :institution', { institution: data.institution });
    }

    if (data.profession) {
      query.andWhere('event_activity_invited.profession = :profession', { profession: data.profession });
    }

    if (data.event_activity_id) {
      query.andWhere('event_activity_invited.event_activity_id = :event_activity_id', {
        event_activity_id: data.event_activity_id,
      });
    }

    if (data.user_id) {
      query.andWhere('event_activity_invited.user_id = :user_id', { user_id: data.user_id });
    }

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: Partial<EventActivityInvited>): Promise<EventActivityInvited> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Partial<EventActivityInvited>): Promise<EventActivityInvited> {
    const create = this.repository.create(data);
    await this.repository.update(id, create);
    return create;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}
export { EventActivityInvitedRepository };
