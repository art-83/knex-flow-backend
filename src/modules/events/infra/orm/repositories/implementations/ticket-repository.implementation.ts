import ITicketRepositoryProvider from '../providers/ticket-repository.provider';
import Ticket from '../../entities/ticket.entity';
import TicketQueryOptions from '../../../../dtos/ticket/ticket-query-options';
import { Repository } from 'typeorm';
import dataSource from '../../../../../../shared/infra/orm/database';

class TicketRepository implements ITicketRepositoryProvider {
  private repository: Repository<Ticket>;

  constructor() {
    this.repository = dataSource.getRepository(Ticket);
  }

  public async find(data: Partial<TicketQueryOptions>): Promise<Ticket[]> {
    const query = this.repository.createQueryBuilder('ticket');

    if (data.id) query.andWhere('ticket.id = :id', { id: data.id });

    if (data.batch_id) query.andWhere('ticket.batch_id = :batch_id', { batch_id: data.batch_id });

    if (data.order_id) query.andWhere('ticket.order_id = :order_id', { order_id: data.order_id });

    if (data.status) query.andWhere('ticket.status = :status', { status: data.status });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: Ticket): Promise<Ticket> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Ticket): Promise<Ticket> {
    const create = this.repository.create(data);
    await this.repository.update(id, create);
    return create;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }

  public async createMany(data: Partial<Ticket>[]): Promise<Ticket[]> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }
}

export default TicketRepository;
