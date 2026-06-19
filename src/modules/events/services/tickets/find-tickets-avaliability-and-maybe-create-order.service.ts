import { inject, injectable } from 'tsyringe';
import { IUserRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IOrderRepositoryProvider } from '../../infra/orm/repositories/providers/order-repository.provider';
import { resolveTicketAvaliability } from '../../utils/resolve-ticket-avaliability';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { Ticket } from '../../infra/orm/entities/ticket.entity';
import { EventActivityQueryOptionsDTO } from '../../dtos/incoming/http/event-activity/event-activity-query-options.dto';
import { CreatePaymentService } from '../../../payments/services/payments/create-payment.service';
import { PaymentMethod } from '../../../payments/infra/orm/enums/payment-method.enum';

@injectable()
class GetTicketsAvaliabilityAndMaybeCreateOrderService {
  constructor(
    @inject('UserRepositoryProvider')
    private userRepository: IUserRepositoryProvider,
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('OrderRepositoryProvider')
    private orderRepository: IOrderRepositoryProvider,
    @inject(CreatePaymentService)
    private createPaymentService: CreatePaymentService,
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
      ? await this.eventActivityRepository.find({ event_id } as Partial<EventActivityQueryOptionsDTO>)
      : [];

    this.validateEventActivitiesBelongToEvent(uniqueActivityIds, eventActivities);

    const outcome = await this.orderRepository.createPendingOrderAttempt({
      user_id: user.id,
      event_id,
      event_activity_ids: uniqueActivityIds,
    });

    switch (outcome.status) {
      case 'no_tickets':
        return {
          message: 'No tickets found.',
          data: null,
        };
      case 'already_registered':
        throw new AppError(
          409,
          'User already registered for this event activity.',
          'Usuario ja inscrito nesta atividade do evento.',
        );
      case 'max_participants':
        throw new AppError(
          409,
          'Event activity has reached maximum participants.',
          'Atividade do evento atingiu o numero maximo de participantes.',
        );
      case 'activity_not_found':
        throw new AppError(
          404,
          'Event activity not found for this event.',
          'Atividade de evento nao encontrada para este evento.',
        );
      case 'success': {
        const result = outcome.data;

        if (!result) {
          throw new AppError(
            500,
            'Order attempt succeeded without result data.',
            'Pedido criado sem dados de retorno.',
          );
        }

        const ticketAvailability = resolveTicketAvaliability(result.ticket as Ticket, result.order);
        const paymentResult = await this.createPaymentService.execute(user.id, {
          order_id: result.order.id,
          method: PaymentMethod.PIX,
        });

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
            payment: paymentResult.payment,
            gatewayPayment: paymentResult.gatewayPayment,
          },
        };
      }
    }
  }

  private validateEventActivitiesBelongToEvent(
    event_activity_ids: string[],
    eventActivities: Awaited<ReturnType<IEventActivityRepositoryProvider['find']>>,
  ) {
    if (!event_activity_ids.length) {
      return;
    }

    const eventActivityMap = new Map(eventActivities.map(activity => [activity.id, activity]));

    for (const eventActivityId of event_activity_ids) {
      if (!eventActivityMap.has(eventActivityId)) {
        throw new AppError(
          404,
          'Event activity not found for this event.',
          'Atividade de evento nao encontrada para este evento.',
        );
      }
    }
  }
}
export { GetTicketsAvaliabilityAndMaybeCreateOrderService };
