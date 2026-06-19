import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { Ticket } from '../../entities/ticket.entity';

interface ITicketRepositoryProvider extends IRepositoryProvider<Ticket> {}
export { ITicketRepositoryProvider };
