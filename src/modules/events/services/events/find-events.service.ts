import { inject, injectable } from 'tsyringe';
import EventQueryOptions from '../../dtos/event/event-query-options';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';

@injectable()
export class FindEventsService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
  ) {}

  public async execute(options: Partial<EventQueryOptions>) {
    const events = await this.eventRepository.find(options);
    return { message: 'Events found successfully.', data: events };
  }
}
