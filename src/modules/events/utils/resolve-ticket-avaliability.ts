import { Order } from '../infra/orm/entities/order.entity';
import { Ticket } from '../infra/orm/entities/ticket.entity';
import { OrderStatus } from '../infra/orm/enums/order-status.enum';
import { TicketAvailability } from '../infra/orm/enums/ticket-availability.enum';

function resolveTicketAvaliability(ticket: Ticket, orderOverride?: Order | null): TicketAvailability {
  const order = orderOverride !== undefined ? orderOverride : ticket.order;

  if (!order) return TicketAvailability.AVAILABLE;

  switch (order.status) {
    case OrderStatus.PENDING:
      return TicketAvailability.RESERVED;
    case OrderStatus.CONFIRMED:
      return TicketAvailability.USABLE;
    case OrderStatus.DISPUTED:
      return TicketAvailability.BLOCKED;
    case OrderStatus.EXPIRED:
    case OrderStatus.CANCELLED:
    case OrderStatus.REFUNDED:
      return TicketAvailability.AVAILABLE;
    default:
      return TicketAvailability.AVAILABLE;
  }
}
export { resolveTicketAvaliability };
