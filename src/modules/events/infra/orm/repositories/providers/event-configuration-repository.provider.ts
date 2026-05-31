import IRepositoryProvider from '../../../../../../shared/infra/orm/providers/repository.provider';
import EventConfiguration from '../../entities/event-configuration.entity';

interface IEventConfigurationRepositoryProvider extends IRepositoryProvider<EventConfiguration> {}

export default IEventConfigurationRepositoryProvider;
