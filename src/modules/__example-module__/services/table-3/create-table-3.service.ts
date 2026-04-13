import CreateOrUpdateTable3DTO from '../../dtos/table-3/create-or-update-table-3.dto';
import { inject, injectable } from 'tsyringe';
import ITable3RepositoryProvider from '../../infra/orm/repositories/providers/table-3-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import IRepositoryProvider from '../../../../shared/infra/orm/repositories/providers/repository.provider';
import { Table } from 'typeorm';
import Table1 from '../../infra/orm/entities/table-1-simple-table.entity';
import Table2 from '../../infra/orm/entities/table-2-table-with-a-join-column.entity';

@injectable()
class CreateTable3Service {
  constructor(
    @inject('Table3Repository')
    private table3RepositoryProvider: ITable3RepositoryProvider,
    @inject('Table1Repository')
    private table1RepositoryProvider: IRepositoryProvider<Table1>,
    @inject('Table2Repository')
    private table2RepositoryProvider: IRepositoryProvider<Table2>,
  ) {}

  public async execute(data: CreateOrUpdateTable3DTO) {
    const [table1, table2] = await Promise.all([
      (await this.table1RepositoryProvider.find({ id: data.table1_id })).at(0),
      (await this.table2RepositoryProvider.find({ id: data.table2_id })).at(0),
    ]);

    if (!table1) {
      throw new AppError(404, 'Table 1 not found.');
    }

    if (!table2) {
      throw new AppError(404, 'Table 2 not found.');
    }

    data.table1 = table1;
    data.table2 = table2;

    const table3 = await this.table3RepositoryProvider.create(data);
    return { message: 'Table 3 created successfully.', data: table3 };
  }
}

export default CreateTable3Service;
