import IEventConfigurationRepositoryProvider from '../providers/event-configuration-repository.provider';
import EventConfiguration from '../../entities/event-configuration.entity';
import EventConfigurationQueryOptions from '../../../../dtos/event-configuration/event-configuration-query-options';
import { Repository } from 'typeorm';
import dataSource from '../../../../../../shared/infra/orm/database';

class EventConfigurationRepository implements IEventConfigurationRepositoryProvider {
  private repository: Repository<EventConfiguration>;

  constructor() {
    this.repository = dataSource.getRepository(EventConfiguration);
  }

  public async find(data: Partial<EventConfigurationQueryOptions>): Promise<EventConfiguration[]> {
    const query = this.repository.createQueryBuilder('event_configuration');

    if (data.id) query.andWhere('event_configuration.id = :id', { id: data.id });

    if (data.event_id) query.andWhere('event_configuration.event_id = :event_id', { event_id: data.event_id });

    if (data.created_at)
      query.andWhere('event_configuration.created_at = :created_at', { created_at: data.created_at });

    if (data.updated_at)
      query.andWhere('event_configuration.updated_at = :updated_at', { updated_at: data.updated_at });

    if (data.start_date)
      query.andWhere('event_configuration.created_at >= :start_date', { start_date: data.start_date });

    if (data.end_date) query.andWhere('event_configuration.created_at <= :end_date', { end_date: data.end_date });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: EventConfiguration): Promise<EventConfiguration> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Partial<EventConfiguration>): Promise<EventConfiguration> {
    const create = this.repository.create(data);
    await this.repository.update(id, create);
    return create;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}

export default EventConfigurationRepository;
