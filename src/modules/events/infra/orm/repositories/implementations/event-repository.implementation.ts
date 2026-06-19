import { IEventRepositoryProvider } from '../providers/event-repository.provider';
import { Event } from '../../entities/event.entity';
import { EventQueryOptionsDTO } from '../../../../dtos/incoming/http/event/event-query-options.dto';
import { EventStatus } from '../../enums/event-status.enum';
import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';
import { AppError } from '../../../../../../shared/infra/http/errors/app-error';

class EventRepository implements IEventRepositoryProvider {
  private repository: Repository<Event>;

  constructor() {
    this.repository = dataSource.getRepository(Event);
  }

  public async find(data: Partial<EventQueryOptionsDTO>): Promise<Event[]> {
    const query = this.repository.createQueryBuilder('event');

    query.leftJoinAndSelect('event.organization', 'organization');
    query.leftJoinAndSelect('event.address', 'address');
    query.leftJoinAndSelect('event.banner_file', 'banner_file');
    query.leftJoinAndSelect('event.icon_file', 'icon_file');

    if (data.id) query.andWhere('event.id = :id', { id: data.id });

    if (data.organization_id)
      query.andWhere('event.organization_id = :organization_id', { organization_id: data.organization_id });

    if (data.name) query.andWhere('event.name = :name', { name: data.name });

    if (data.description) query.andWhere('event.description = :description', { description: data.description });

    if (data.url_path) query.andWhere('event.url_path = :url_path', { url_path: data.url_path });

    if (data.status) query.andWhere('event.status = :status', { status: data.status });

    if (data.start_date) query.andWhere('event.start_date >= :start_date', { start_date: data.start_date });

    if (data.end_date) query.andWhere('event.end_date <= :end_date', { end_date: data.end_date });

    if (data.created_at) query.andWhere('event.created_at = :created_at', { created_at: data.created_at });

    if (data.updated_at) query.andWhere('event.updated_at = :updated_at', { updated_at: data.updated_at });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: Event): Promise<Event> {
    const create = this.repository.create({
      ...data,
      status: data.status ?? EventStatus.DRAFT,
    });
    const saved = await this.repository.save(create);
    const reloaded = (await this.find({ id: saved.id })).at(0);

    return reloaded ?? saved;
  }

  public async update(id: string, data: Partial<Event>): Promise<Event> {
    await this.repository.save({ id, ...data });
    const updated = (await this.find({ id })).at(0);

    if (!updated) {
      throw new AppError(404, 'Event not found after update.', 'Evento nao encontrado apos atualizacao.');
    }

    return updated;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}
export { EventRepository };
