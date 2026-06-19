import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { EventActivityQueryOptionsDTO } from '../../dtos/incoming/http/event-activity/event-activity-query-options.dto';
import { EventActivityPresenceQueryOptionsDTO } from '../../dtos/incoming/http/event-activity-presence/event-activity-presence-query-options.dto';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventActivityPresenceRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-presence-repository.provider';
import { EventStatus } from '../../infra/orm/enums/event-status.enum';

@injectable()
class FindUserEventActivityEnrollmentsService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('EventActivityPresenceRepositoryProvider')
    private eventActivityPresenceRepository: IEventActivityPresenceRepositoryProvider,
  ) {}

  public async execute(user_id: string, event_id: string) {
    const event = (await this.eventRepository.find({ id: event_id, status: EventStatus.ACTIVE })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    const activities = await this.eventActivityRepository.find({ event_id } as Partial<EventActivityQueryOptionsDTO>);

    if (!activities.length) {
      return {
        message: 'User event activity enrollments found successfully.',
        data: {
          event_id,
          event_activity_ids: [],
        },
      };
    }

    const enrolledActivityIds: string[] = [];

    for (const activity of activities) {
      const presence = (
        await this.eventActivityPresenceRepository.find({
          event_activity_id: activity.id,
          user_id,
          limit: 1,
        } as Partial<EventActivityPresenceQueryOptionsDTO>)
      ).at(0);

      if (presence) {
        enrolledActivityIds.push(activity.id);
      }
    }

    return {
      message: 'User event activity enrollments found successfully.',
      data: {
        event_id,
        event_activity_ids: enrolledActivityIds,
      },
    };
  }
}
export { FindUserEventActivityEnrollmentsService };
