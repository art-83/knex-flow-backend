import Ticket from '../../orm/entities/ticket.entity';
import { resolveTicketAvailability } from '../../../domain/resolve-ticket-availability';
import { TicketAvailability } from '../../../domain/ticket-availability.enum';

export type TicketResponse = Ticket & {
  availability: TicketAvailability;
};

export function mapTicketToResponse(ticket: Ticket): TicketResponse {
  return {
    ...ticket,
    availability: resolveTicketAvailability(ticket.order?.status ?? null),
  };
}
