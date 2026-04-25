import { inject, injectable } from 'tsyringe';
import CreateOrUpdateEventDTO from '../../dtos/event/create-or-update-event.dto';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';

@injectable()
export class UpdateEventService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
  ) {}

  public async execute(event_id: string, data: Partial<CreateOrUpdateEventDTO>) {
    const event = await this.eventRepository.update(event_id, data);
    return { message: 'Event updated successfully.', data: event };
  }
}
