import { OrderStatus } from '../infra/orm/enums/order-status.enum';
import { TicketAvailability } from './ticket-availability.enum';

export function resolveTicketAvailability(orderStatus: OrderStatus | null | undefined): TicketAvailability {
  if (!orderStatus) return TicketAvailability.AVAILABLE;

  switch (orderStatus) {
    case OrderStatus.PENDING:
      return TicketAvailability.RESERVED;
    case OrderStatus.CONFIRMED:
      return TicketAvailability.USABLE;
    case OrderStatus.DISPUTED:
      return TicketAvailability.BLOCKED;
    case OrderStatus.EXPIRED:
    case OrderStatus.CANCELLED:
    case OrderStatus.REFUNDED:
    default:
      return TicketAvailability.AVAILABLE;
  }
}
