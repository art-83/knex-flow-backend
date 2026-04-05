import CreateOrUpdateTable3DTO from '../../dtos/table-3/create-or-update-table-3.dto';
import Table3 from '../../infra/orm/entities/table-3-many-to-many-table.entity';
import { inject, injectable } from 'tsyringe';
import ITable3RepositoryProvider from '../../infra/orm/repositories/providers/table-3-repository.provider';

@injectable()
class UpdateTable3Service {
  constructor(
    @inject('Table3RepositoryProvider')
    private table3RepositoryProvider: ITable3RepositoryProvider,
  ) {}

  public async execute(id: string, data: CreateOrUpdateTable3DTO) {
    const table3 = await this.table3RepositoryProvider.update(id, data);
    return { message: 'Table 3 updated successfully.', data: table3 };
  }
}

export default UpdateTable3Service;
