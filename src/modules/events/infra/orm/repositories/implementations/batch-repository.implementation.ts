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

    if (data.id) query.andWhere('batch.id = :id', { id: data.id });

    if (data.event_id) query.andWhere('batch.event_id = :event_id', { event_id: data.event_id });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async create(data: Batch): Promise<Batch> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Batch): Promise<Batch> {
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
