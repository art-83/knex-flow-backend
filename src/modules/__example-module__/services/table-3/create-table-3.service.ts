import CreateOrUpdateTable3DTO from '../../dtos/table-3/create-or-update-table-3.dto';
import { inject, injectable } from 'tsyringe';
import ITable3RepositoryProvider from '../../infra/orm/repositories/providers/table-3-repository.provider';

@injectable()
class CreateTable3Service {
  constructor(
    @inject('Table3RepositoryProvider')
    private table3RepositoryProvider: ITable3RepositoryProvider,
  ) {}

  public async execute(data: CreateOrUpdateTable3DTO) {
    const table3 = await this.table3RepositoryProvider.create(data);
    return { message: 'Table 3 created successfully.', data: table3 };
  }
}

export default CreateTable3Service;
