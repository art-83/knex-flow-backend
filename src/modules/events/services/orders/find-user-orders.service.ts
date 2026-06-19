import { inject, injectable } from 'tsyringe';
import { paymentsConfig } from '../../../../config/payments.config';
import { IOrderRepositoryProvider } from '../../infra/orm/repositories/providers/order-repository.provider';
import { OrderQueryOptionsDTO } from '../../dtos/incoming/http/order/order-query-options.dto';
import { FindUserOrdersResponseDTO } from '../../dtos/outgoing/http/orders/find-user-orders-response.dto';
import { Order } from '../../infra/orm/entities/order.entity';
import { PaymentStatus } from '../../../payments/infra/orm/enums/payment-status.enum';
import { resolveTicketAvaliability } from '../../utils/resolve-ticket-avaliability';

@injectable()
class FindUserOrdersService {
  constructor(
    @inject('OrderRepositoryProvider')
    private orderRepository: IOrderRepositoryProvider,
  ) {}

  async execute(user_id: string, options: Partial<OrderQueryOptionsDTO>): Promise<FindUserOrdersResponseDTO> {
    const queryOptions = {
      user_id,
      ...options,
    } as Partial<OrderQueryOptionsDTO>;
    const orders = await this.orderRepository.find(queryOptions);
    return {
      message: 'User orders found successfully.',
      data: orders.map(order => this.mapOrder(order)),
      meta: {
        refund_window_days: paymentsConfig.refundWindowDays,
      },
    };
  }

  private mapOrder(order: Order) {
    let ticket = null;
    if (order.tickets && order.tickets.length > 0) {
      ticket = order.tickets.at(0);
    }

    let event = null;
    if (ticket && ticket.batch && ticket.batch.event) {
      event = ticket.batch.event;
    }

    const paidPayment = order.payments?.find(payment => payment.status === PaymentStatus.PAID);

    return {
      id: order.id,
      status: order.status,
      total_amount: order.total_amount,
      created_at: order.created_at,
      updated_at: order.updated_at,
      paid_at: paidPayment?.paid_at ?? paidPayment?.updated_at ?? null,
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
