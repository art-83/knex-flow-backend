import { inject, injectable } from 'tsyringe';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';

@injectable()
export class DeleteEventService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
  ) {}

  public async execute(event_id: string) {
    const rowsDeleted = await this.eventRepository.delete(event_id);
    return { message: 'Event deleted successfully.', deleted: rowsDeleted };
  }
}
