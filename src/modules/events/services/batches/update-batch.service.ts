import { inject, injectable } from 'tsyringe';
import CreateOrUpdateBatchDTO from '../../dtos/batch/create-or-update-batch.dto';
import IBatchRepositoryProvider from '../../infra/orm/repositories/providers/batch-repository.provider';

@injectable()
export class UpdateBatchService {
  constructor(
    @inject('BatchRepositoryProvider')
    private batchRepository: IBatchRepositoryProvider,
  ) {}

  public async execute(batch_id: string, data: Partial<CreateOrUpdateBatchDTO>) {
    const batch = await this.batchRepository.update(batch_id, data);
    return { message: 'Batch updated successfully.', data: batch };
  }
}
