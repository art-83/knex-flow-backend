import { Ticket } from '../../infra/orm/entities/ticket.entity';

interface CreateOrUpdateTicketDTO extends Ticket {
  batch_id: string;
  order_id: string;
}
export { CreateOrUpdateTicketDTO };
