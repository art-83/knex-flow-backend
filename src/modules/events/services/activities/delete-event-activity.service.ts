import { inject, injectable } from 'tsyringe';
import IEventActivityRepositoryProvider from '../../infra/orm/repositories/providers/event-activity-repository.provider';

@injectable()
export class DeleteEventActivityService {
  constructor(
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
  ) {}

  public async execute(event_activity_id: string) {
    const rowsDeleted = await this.eventActivityRepository.delete(event_activity_id);
    return { message: 'Event activity deleted successfully.', deleted: rowsDeleted };
  }
}
