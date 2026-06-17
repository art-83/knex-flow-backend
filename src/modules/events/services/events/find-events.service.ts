import { inject, injectable } from 'tsyringe';
import { EventQueryOptions } from '../../dtos/event/event-query-options';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventActivityInvitedRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-invited-repository.provider';
import { ITicketRepositoryProvider } from '../../infra/orm/repositories/providers/ticket-repository.provider';
import { EventActivityQueryOptions } from '../../dtos/event-activity/event-activity-query-options';
import { EventActivityInvitedQueryOptions } from '../../dtos/event-activity-invited/event-activity-invited-query-options';
import { TicketQueryOptions } from '../../dtos/ticket/ticket-query-options';
import { EventActivity } from '../../infra/orm/entities/event-activity.entity';
import { EventActivityInvited } from '../../infra/orm/entities/event-activity-invited.entity';

@injectable()
class FindEventsService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('EventActivityInvitedRepositoryProvider')
    private eventActivityInvitedRepository: IEventActivityInvitedRepositoryProvider,
    @inject('TicketRepositoryProvider')
    private ticketRepository: ITicketRepositoryProvider,
  ) {}

  public async execute(options: Partial<EventQueryOptions>) {
    const events = await this.eventRepository.find(options);

    if (!events.length) {
      return { message: 'Events found successfully.', data: [] };
    }

    const eventIds = events.map(event => event.id);

    const [activitiesByEvent, invitedByEvent, ticketsByEvent] = await Promise.all([
      Promise.all(
        eventIds.map(event_id => this.eventActivityRepository.find({ event_id } as Partial<EventActivityQueryOptions>)),
      ),
      Promise.all(
        eventIds.map(event_id =>
          this.eventActivityInvitedRepository.find({ event_id } as Partial<EventActivityInvitedQueryOptions>),
        ),
      ),
      Promise.all(
        eventIds.map(event_id =>
          this.ticketRepository.find({ event_id, order_is_null: true } as Partial<TicketQueryOptions>),
        ),
      ),
    ]);

    const response = events.map((event, index) => {
      const activities = activitiesByEvent[index] ?? [];
      const invited = invitedByEvent[index] ?? [];
      const availableTickets = ticketsByEvent[index] ?? [];

      return {
        id: event.id,
        name: event.name,
        description: event.description,
        start_date: event.start_date,
        end_date: event.end_date,
        modality: event.modality,
        organization: {
          id: event.organization.id,
          name: event.organization.name,
        },
        available_tickets_count: availableTickets.length,
        activities: activities.map(activity => this.mapActivity(activity)),
        invited: invited.map(item => this.mapInvited(item)),
      };
    });

    return { message: 'Events found successfully.', data: response };
  }

  private mapActivity(activity: EventActivity) {
    return {
      id: activity.id,
      hours_to_retrieve: activity.hours_to_retrieve,
      max_participants: activity.max_participants,
      start_date: activity.start_date,
      end_date: activity.end_date,
    };
  }

  private mapInvited(invited: EventActivityInvited) {
    return {
      id: invited.id,
      event_activity_id: invited.event_activity.id,
      name: invited.name,
      institution: invited.institution,
      profession: invited.profession,
      user_id: invited.user?.id ?? null,
    };
  }
}
export { FindEventsService };
