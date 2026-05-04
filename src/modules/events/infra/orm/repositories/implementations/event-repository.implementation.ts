import IEventRepositoryProvider from '../providers/event-repository.provider';
import Event from '../../entities/event.entity';
import EventQueryOptions from '../../../../dtos/event/event-query-options';
import { Repository } from 'typeorm';
import dataSource from '../../../../../../shared/infra/orm/database';

class EventRepository implements IEventRepositoryProvider {
  private repository: Repository<Event>;

  constructor() {
    this.repository = dataSource.getRepository(Event);
  }

  public async find(data: Partial<EventQueryOptions>): Promise<Event[]> {
    const query = this.repository.createQueryBuilder('event');

    query.leftJoinAndSelect('event.organization', 'organization');

    if (data.id) query.andWhere('event.id = :id', { id: data.id });

    if (data.organization_id)
      query.andWhere('event.organization_id = :organization_id', { organization_id: data.organization_id });

    if (data.name) query.andWhere('event.name = :name', { name: data.name });

    if (data.description) query.andWhere('event.description = :description', { description: data.description });

    if (data.start_date) query.andWhere('event.start_date >= :start_date', { start_date: data.start_date });

    if (data.end_date) query.andWhere('event.end_date <= :end_date', { end_date: data.end_date });

    if (data.created_at) query.andWhere('event.created_at = :created_at', { created_at: data.created_at });

    if (data.updated_at) query.andWhere('event.updated_at = :updated_at', { updated_at: data.updated_at });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: Event): Promise<Event> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Partial<Event>): Promise<Event> {
    const update = this.repository.create(data);
    await this.repository.update(id, update);
    return update;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}

export default EventRepository;
