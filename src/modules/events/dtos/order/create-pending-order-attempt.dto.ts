import { EventActivityPresence } from '../../infra/orm/entities/event-activity-presence.entity';
import { Order } from '../../infra/orm/entities/order.entity';
import { Ticket } from '../../infra/orm/entities/ticket.entity';

interface CreatePendingOrderAttemptDTO {
  user_id: string;
  event_id: string;
  event_activity_ids: string[];
}

interface CreatePendingOrderAttemptResult {
  ticket: Ticket;
  order: Order;
  presences: EventActivityPresence[];
}
export { CreatePendingOrderAttemptDTO, CreatePendingOrderAttemptResult };
