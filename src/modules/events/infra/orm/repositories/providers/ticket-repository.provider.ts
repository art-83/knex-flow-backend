import IRepositoryProvider from '../../../../../../shared/infra/orm/infra/providers/repository.provider';
import Ticket from '../../entities/ticket.entity';

interface ITicketRepositoryProvider extends IRepositoryProvider<Ticket> {
  createMany(data: Ticket[]): Promise<Ticket[]>;
}

export default ITicketRepositoryProvider;
