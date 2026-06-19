import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { Ticket } from '../../../../infra/orm/entities/ticket.entity';

interface TicketQueryOptionsDTO extends Ticket, DefaultQueryOptionsDTO {
  batch_id: string;
  event_id: string;
  order_id: string;
}
export { TicketQueryOptionsDTO };
