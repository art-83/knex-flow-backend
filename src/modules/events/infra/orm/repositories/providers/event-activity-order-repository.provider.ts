import IRepositoryProvider from '../../../../../../shared/infra/orm/repositories/providers/repository.provider';
import EventActivityPresence from '../../entities/event-activity-presence.entity';

interface IEventActivityOrderRepositoryProvider extends IRepositoryProvider<EventActivityPresence> {
  createMany(data: Partial<EventActivityPresence>[]): Promise<EventActivityPresence[]>;
}

export default IEventActivityOrderRepositoryProvider;
