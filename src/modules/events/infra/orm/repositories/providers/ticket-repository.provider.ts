import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import Ticket from '../../entities/ticket.entity';

interface ITicketRepositoryProvider extends IRepositoryProvider<Ticket> {
  createMany(data: Partial<Ticket>[]): Promise<Ticket[]>;
}

export default ITicketRepositoryProvider;
