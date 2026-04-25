import { inject, injectable } from 'tsyringe';
import IBatchRepositoryProvider from '../../infra/orm/repositories/providers/batch-repository.provider';

@injectable()
export class DeleteBatchService {
  constructor(
    @inject('BatchRepositoryProvider')
    private batchRepository: IBatchRepositoryProvider,
  ) {}

  public async execute(batch_id: string) {
    const rowsDeleted = await this.batchRepository.delete(batch_id);
    return { message: 'Batch deleted successfully.', deleted: rowsDeleted };
  }
}
