import ITable3RepositoryProvider from '../providers/table-3-repository.provider';
import Table3 from '../../entities/table-3-many-to-many-table.entity';
import Table3QueryOptions from '../../../../dtos/table-3/table-3-query-options';
import { Repository } from 'typeorm';
import dataSource from '../../../../../../shared/infra/orm/database';
import CreateOrUpdateTable3DTO from '../../../../dtos/table-3/create-or-update-table-3.dto';

class Table3Repository implements ITable3RepositoryProvider {
  private repository: Repository<Table3>;

  constructor() {
    this.repository = dataSource.getRepository(Table3);
  }

  public async find(data: Partial<Table3QueryOptions>): Promise<Table3[]> {
    const query = this.repository.createQueryBuilder('table3');

    if (data.id) query.andWhere('table3.id = :id', { id: data.id });

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    if (data.table1_id) query.andWhere('table3.table1_id = :table1_id', { table1_id: data.table1_id });
    if (data.table2_id) query.andWhere('table3.table2_id = :table2_id', { table2_id: data.table2_id });

    return await query.getMany();
  }

  public async create(data: CreateOrUpdateTable3DTO): Promise<Table3> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Table3): Promise<Table3> {
    const create = this.repository.create(data);
    await this.repository.update(id, create);
    return create;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }

  public async countAmountofTable1PlusTable2(): Promise<number> {
    const query = this.repository.createQueryBuilder('table3');
    query.select('SUM(table3.table1_id + table3.table2_id)', 'amount');
    const result = await query.getRawOne();
    return Number(result.amount);
  }
}

export default Table3Repository;
