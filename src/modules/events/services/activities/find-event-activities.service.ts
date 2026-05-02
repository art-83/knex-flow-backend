import { inject, injectable } from 'tsyringe';
import EventActivityQueryOptions from '../../dtos/event-activity/event-activity-query-options';
import IEventActivityRepositoryProvider from '../../infra/orm/repositories/providers/event-activity-repository.provider';

@injectable()
export class FindEventActivitiesService {
  constructor(
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
  ) {}

  public async execute(options: Partial<EventActivityQueryOptions>) {
    const eventActivities = await this.eventActivityRepository.find(options);
    return { message: 'Event activities found successfully.', data: eventActivities };
  }
}
