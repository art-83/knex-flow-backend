import { inject, injectable } from 'tsyringe';
import IActivityRepositoryProvider from '../../infra/orm/repositories/providers/activity-repository.provider';

@injectable()
export class DeleteActivityService {
  constructor(
    @inject('ActivityRepositoryProvider')
    private activityRepository: IActivityRepositoryProvider,
  ) {}

  public async execute(activity_id: string) {
    const rowsDeleted = await this.activityRepository.delete(activity_id);
    return { message: 'Activity deleted successfully.', deleted: rowsDeleted };
  }
}
