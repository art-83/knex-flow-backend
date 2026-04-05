import Table3 from '../../infra/orm/entities/table-3-many-to-many-table.entity';
import { inject, injectable } from 'tsyringe';
import ITable3RepositoryProvider from '../../infra/orm/repositories/providers/table-3-repository.provider';

@injectable()
class FindTable3Service {
  constructor(
    @inject('Table3RepositoryProvider')
    private table3RepositoryProvider: ITable3RepositoryProvider,
  ) {}

  public async execute(options: Partial<Table3>) {
    const table3 = await this.table3RepositoryProvider.find(options);
    return { message: 'Table 3 found successfully.', data: table3 };
  }
}

export default FindTable3Service;
