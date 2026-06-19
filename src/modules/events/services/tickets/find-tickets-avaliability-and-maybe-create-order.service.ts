import { inject, injectable } from 'tsyringe';
import { IUserRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventActivityPresenceRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-presence-repository.provider';
import { IOrderRepositoryProvider } from '../../infra/orm/repositories/providers/order-repository.provider';
import { resolveTicketAvaliability } from '../../utils/resolve-ticket-avaliability';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { Ticket } from '../../infra/orm/entities/ticket.entity';
import { EventActivityQueryOptions } from '../../dtos/event-activity/event-activity-query-options';
import { EventActivityPresenceQueryOptions } from '../../dtos/event-activity-presence/event-activity-presence-query-options';

@injectable()
class GetTicketsAvaliabilityAndMaybeCreateOrderService {
  constructor(
    @inject('UserRepositoryProvider')
    private userRepository: IUserRepositoryProvider,
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('EventActivityPresenceRepositoryProvider')
    private eventActivityPresenceRepository: IEventActivityPresenceRepositoryProvider,
    @inject('OrderRepositoryProvider')
    private orderRepository: IOrderRepositoryProvider,
  ) {}

  async execute(user_id: string, event_id: string, event_activity_ids: string[] = []) {
    const user = (await this.userRepository.find({ id: user_id })).at(0);

    if (!user) {
      return {
        message: 'User not found.',
        data: null,
      };
    }

    const uniqueActivityIds = [...new Set(event_activity_ids)];

    if (uniqueActivityIds.length !== event_activity_ids.length) {
      throw new AppError(
        400,
        'Duplicate event activities are not allowed.',
        'Atividades duplicadas nao sao permitidas.',
      );
    }

    const eventActivities = uniqueActivityIds.length
      ? await this.eventActivityRepository.find({ event_id } as Partial<EventActivityQueryOptions>)
      : [];

    await this.validateEventActivities(uniqueActivityIds, eventActivities, user_id);

    const result = await this.orderRepository.createPendingOrderAttempt({
      user_id: user.id,
      event_id,
      event_activity_ids: uniqueActivityIds,
    });

    if (!result) {
      return {
        message: 'No tickets found.',
        data: null,
      };
    }

    const ticketAvailability = resolveTicketAvaliability(result.ticket as Ticket, result.order);

    return {
      message: 'Tickets available! Order created successfully.',
      data: {
        ticket: {
          ...result.ticket,
          order: result.order,
        },
        order: result.order,
        event_activity_presences: result.presences.map((presence, index) => ({
          id: presence.id,
          event_activity_id: uniqueActivityIds[index]!,
          user_presence: presence.user_presence,
        })),
        ticketAvailability,
      },
    };
  }

  private async validateEventActivities(
    event_activity_ids: string[],
    eventActivities: Awaited<ReturnType<IEventActivityRepositoryProvider['find']>>,
    user_id: string,
  ) {
    if (!event_activity_ids.length) {
      return;
    }

    const eventActivityMap = new Map(eventActivities.map(activity => [activity.id, activity]));

    for (const eventActivityId of event_activity_ids) {
      const eventActivity = eventActivityMap.get(eventActivityId);

      if (!eventActivity) {
        throw new AppError(
          404,
          'Event activity not found for this event.',
          'Atividade de evento nao encontrada para este evento.',
        );
      }

      const existingPresence = (
        await this.eventActivityPresenceRepository.find({
          event_activity_id: eventActivityId,
          user_id,
          limit: 1,
        } as Partial<EventActivityPresenceQueryOptions>)
      ).at(0);

      if (existingPresence) {
        throw new AppError(
          409,
          'User already registered for this event activity.',
          'Usuario ja inscrito nesta atividade do evento.',
        );
      }

      if (eventActivity.max_participants != null) {
        const presenceCount = await this.eventActivityPresenceRepository.countByEventActivity(eventActivityId);

        if (presenceCount >= eventActivity.max_participants) {
          throw new AppError(
            409,
            'Event activity has reached maximum participants.',
            'Atividade do evento atingiu o numero maximo de participantes.',
          );
        }
      }
    }
  }
}
export { GetTicketsAvaliabilityAndMaybeCreateOrderService };
