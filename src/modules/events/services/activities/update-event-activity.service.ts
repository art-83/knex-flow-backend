import { inject, injectable } from 'tsyringe';
import CreateOrUpdateEventActivityDTO from '../../dtos/event-activity/create-or-update-event-activity.dto';
import IEventActivityRepositoryProvider from '../../infra/orm/repositories/providers/event-activity-repository.provider';

@injectable()
export class UpdateEventActivityService {
  constructor(
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
  ) {}

  public async execute(event_activity_id: string, data: Partial<CreateOrUpdateEventActivityDTO>) {
    const eventActivity = await this.eventActivityRepository.update(event_activity_id, data);
    return { message: 'Event activity updated successfully.', data: eventActivity };
  }
}
