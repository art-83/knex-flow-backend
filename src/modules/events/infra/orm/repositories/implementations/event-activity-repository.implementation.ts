import IEventActivityRepositoryProvider from '../providers/event-activity-repository.provider';
import EventActivity from '../../entities/event-activity.entity';
import EventActivityQueryOptions from '../../../../dtos/event-activity/event-activity-query-options';
import { Repository } from 'typeorm';
import dataSource from '../../../../../../shared/infra/orm/database';

class EventActivityRepository implements IEventActivityRepositoryProvider {
  private repository: Repository<EventActivity>;

  constructor() {
    this.repository = dataSource.getRepository(EventActivity);
  }

  public async find(data: Partial<EventActivityQueryOptions>): Promise<EventActivity[]> {
    const query = this.repository.createQueryBuilder('event_activity');

    if (data.id) query.andWhere('event_activity.id = :id', { id: data.id });

    if (data.event_id) query.andWhere('event_activity.event_id = :event_id', { event_id: data.event_id });

    if (data.activity_id)
      query.andWhere('event_activity.activity_id = :activity_id', { activity_id: data.activity_id });

    if (data.hours_to_retrieve !== undefined) {
      query.andWhere('event_activity.hours_to_retrieve = :hours_to_retrieve', {
        hours_to_retrieve: data.hours_to_retrieve,
      });
    }

    if (data.max_participants !== undefined) {
      query.andWhere('event_activity.max_participants = :max_participants', {
        max_participants: data.max_participants,
      });
    }

    if (data.start_date) query.andWhere('event_activity.start_date >= :start_date', { start_date: data.start_date });

    if (data.end_date) query.andWhere('event_activity.end_date <= :end_date', { end_date: data.end_date });

    if (data.created_at) query.andWhere('event_activity.created_at = :created_at', { created_at: data.created_at });

    if (data.updated_at) query.andWhere('event_activity.updated_at = :updated_at', { updated_at: data.updated_at });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: EventActivity): Promise<EventActivity> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Partial<EventActivity>): Promise<EventActivity> {
    const create = this.repository.create(data);
    await this.repository.update(id, create);
    return create;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}

export default EventActivityRepository;
