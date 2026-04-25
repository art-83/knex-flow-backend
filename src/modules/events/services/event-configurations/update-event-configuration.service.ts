import { inject, injectable } from 'tsyringe';
import CreateOrUpdateEventConfigurationDTO from '../../dtos/event-configuration/create-or-update-event-configuration.dto';
import IEventConfigurationRepositoryProvider from '../../infra/orm/repositories/providers/event-configuration-repository.provider';

@injectable()
export class UpdateEventConfigurationService {
  constructor(
    @inject('EventConfigurationRepositoryProvider')
    private eventConfigurationRepository: IEventConfigurationRepositoryProvider,
  ) {}

  public async execute(event_configuration_id: string, data: Partial<CreateOrUpdateEventConfigurationDTO>) {
    const eventConfiguration = await this.eventConfigurationRepository.update(event_configuration_id, data);

    return { message: 'Event configuration updated successfully.', data: eventConfiguration };
  }
}
