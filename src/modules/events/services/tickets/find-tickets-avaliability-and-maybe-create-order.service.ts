import { TicketQueryOptions } from '../../dtos/ticket/ticket-query-options';
import { ITicketRepositoryProvider } from '../../infra/orm/repositories/providers/ticket-repository.provider';
import { inject, injectable } from 'tsyringe';
import { resolveTicketAvaliability } from '../../utils/resolve-ticket-avaliability';
import { IUserRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-repository.provider';
import { IOrderRepositoryProvider } from '../../infra/orm/repositories/providers/order-repository.provider';
import { OrderStatus } from '../../infra/orm/enums/order-status.enum';

@injectable()
class GetTicketsAvaliabilityAndMaybeCreateOrderService {
  constructor(
    @inject('TicketRepositoryProvider')
    private ticketRepository: ITicketRepositoryProvider,
    @inject('UserRepositoryProvider')
    private userRepository: IUserRepositoryProvider,
    @inject('OrderRepositoryProvider')
    private orderRepository: IOrderRepositoryProvider,
  ) {}

  async execute(user_id: string, event_id: string) {
    const queryOptions = {
      event_id,
      order_is_null: true,
    } as Partial<TicketQueryOptions>;

    const ticket = (await this.ticketRepository.find(queryOptions)).at(0);

    if (!ticket) {
      return {
        message: 'No tickets found.',
        data: null,
      };
    }

    const ticketAvailability = resolveTicketAvaliability(ticket);

    const user = (await this.userRepository.find({ id: user_id })).at(0);

    if (!user) {
      return {
        message: 'User not found.',
        data: null,
      };
    }

    const order = await this.orderRepository.create({
      user,
      total_amount: ticket.batch.price,
      status: OrderStatus.PENDING,
    });

    await this.ticketRepository.update(ticket.id, { order: order });

    return {
      message: 'Tickets available! Order created successfully.',
      data: {
        ticket: {
          ...ticket,
          order: order,
        },
        ticketAvailability,
      },
    };
  }
}
export { GetTicketsAvaliabilityAndMaybeCreateOrderService };
