import { inject, injectable } from 'tsyringe';
import { IOrderRepositoryProvider } from '../../infra/orm/repositories/providers/order-repository.provider';
import { OrderQueryOptions } from '../../dtos/order/order-query-options';
import { Order } from '../../infra/orm/entities/order.entity';
import { resolveTicketAvaliability } from '../../utils/resolve-ticket-avaliability';

@injectable()
class FindUserOrdersService {
  constructor(
    @inject('OrderRepositoryProvider')
    private orderRepository: IOrderRepositoryProvider,
  ) {}

  async execute(user_id: string, options: Partial<OrderQueryOptions>) {
    const queryOptions = {
      user_id,
      ...options,
    } as Partial<OrderQueryOptions>;
    const orders = await this.orderRepository.find(queryOptions);
    return {
      message: 'User orders found successfully.',
      data: orders.map(order => this.mapOrder(order)),
    };
  }

  private mapOrder(order: Order) {
    const ticket = order.tickets?.at(0);
    const event = ticket?.batch?.event;

    return {
      id: order.id,
      status: order.status,
      total_amount: order.total_amount,
      created_at: order.created_at,
      updated_at: order.updated_at,
      ticket: ticket
        ? {
            id: ticket.id,
            availability: resolveTicketAvaliability(ticket, order),
          }
        : null,
      event: event
        ? {
            id: event.id,
            name: event.name,
            start_date: event.start_date,
            end_date: event.end_date,
          }
        : null,
    };
  }
}
export { FindUserOrdersService };
