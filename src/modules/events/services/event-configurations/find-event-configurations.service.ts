import { inject, injectable } from 'tsyringe';
import EventConfigurationQueryOptions from '../../dtos/event-configuration/event-configuration-query-options';
import IEventConfigurationRepositoryProvider from '../../infra/orm/repositories/providers/event-configuration-repository.provider';

@injectable()
export class FindEventConfigurationsService {
  constructor(
    @inject('EventConfigurationRepositoryProvider')
    private eventConfigurationRepository: IEventConfigurationRepositoryProvider,
  ) {}

  public async execute(options: Partial<EventConfigurationQueryOptions>) {
    const eventConfigurations = await this.eventConfigurationRepository.find(options);
    return { message: 'Event configurations found successfully.', data: eventConfigurations };
  }
}
