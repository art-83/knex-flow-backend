import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { Ticket } from '../../infra/orm/entities/ticket.entity';

interface TicketQueryOptions extends Ticket, DefaultQueryOptionsDTO {
  batch_id: string;
  event_id: string;
  order_id: string;
}
export { TicketQueryOptions };
