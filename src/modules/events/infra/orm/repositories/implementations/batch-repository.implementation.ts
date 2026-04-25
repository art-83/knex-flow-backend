import IBatchRepositoryProvider from '../providers/batch-repository.provider';
import Batch from '../../entities/batch.entity';
import BatchQueryOptions from '../../../../dtos/batch/batch-query-options';
import { Repository } from 'typeorm';
import dataSource from '../../../../../../shared/infra/orm/database';

class BatchRepository implements IBatchRepositoryProvider {
  private repository: Repository<Batch>;

  constructor() {
    this.repository = dataSource.getRepository(Batch);
  }

  public async find(data: Partial<BatchQueryOptions>): Promise<Batch[]> {
    const query = this.repository.createQueryBuilder('batch');

    query.leftJoinAndSelect('batch.event', 'event');

    if (data.id) query.andWhere('batch.id = :id', { id: data.id });

    if (data.event_id) query.andWhere('batch.event_id = :event_id', { event_id: data.event_id });

    if (data.base_quantity)
      query.andWhere('batch.base_quantity = :base_quantity', { base_quantity: data.base_quantity });

    if (data.price) query.andWhere('batch.price = :price', { price: data.price });

    if (data.created_at) query.andWhere('batch.created_at = :created_at', { created_at: data.created_at });

    if (data.updated_at) query.andWhere('batch.updated_at = :updated_at', { updated_at: data.updated_at });

    if (data.start_date) query.andWhere('batch.created_at >= :start_date', { start_date: data.start_date });

    if (data.end_date) query.andWhere('batch.created_at <= :end_date', { end_date: data.end_date });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: Batch): Promise<Batch> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Partial<Batch>): Promise<Batch> {
    const create = this.repository.create(data);
    await this.repository.update(id, create);
    return create;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }
}

export default BatchRepository;
