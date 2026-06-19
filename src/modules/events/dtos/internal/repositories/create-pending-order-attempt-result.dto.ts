import { EventActivityPresence } from '../../../infra/orm/entities/event-activity-presence.entity';
import { Order } from '../../../infra/orm/entities/order.entity';
import { Ticket } from '../../../infra/orm/entities/ticket.entity';

interface CreatePendingOrderAttemptResultDTO {
  ticket: Ticket;
  order: Order;
  presences: EventActivityPresence[];
}
export { CreatePendingOrderAttemptResultDTO };
