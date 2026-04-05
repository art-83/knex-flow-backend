import { inject, injectable } from 'tsyringe';
import ITable3RepositoryProvider from '../../infra/orm/repositories/providers/table-3-repository.provider';

@injectable()
class DeleteTable3Service {
  constructor(
    @inject('Table3RepositoryProvider')
    private table3RepositoryProvider: ITable3RepositoryProvider,
  ) {}

  public async execute(id: string) {
    const rowsDeleted = await this.table3RepositoryProvider.delete(id);
    return { message: 'Table 3 deleted successfully.', deleted: rowsDeleted };
  }
}

export default DeleteTable3Service;
