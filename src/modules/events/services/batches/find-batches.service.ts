import { inject, injectable } from 'tsyringe';
import BatchQueryOptions from '../../dtos/batch/batch-query-options';
import IBatchRepositoryProvider from '../../infra/orm/repositories/providers/batch-repository.provider';

@injectable()
export class FindBatchesService {
  constructor(
    @inject('BatchRepositoryProvider')
    private batchRepository: IBatchRepositoryProvider,
  ) {}

  public async execute(options: Partial<BatchQueryOptions>) {
    const batches = await this.batchRepository.find(options);
    return { message: 'Batches found successfully.', data: batches };
  }
}
