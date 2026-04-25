import { inject, injectable } from 'tsyringe';
import IEventConfigurationRepositoryProvider from '../../infra/orm/repositories/providers/event-configuration-repository.provider';

@injectable()
export class DeleteEventConfigurationService {
  constructor(
    @inject('EventConfigurationRepositoryProvider')
    private eventConfigurationRepository: IEventConfigurationRepositoryProvider,
  ) {}

  public async execute(event_configuration_id: string) {
    const rowsDeleted = await this.eventConfigurationRepository.delete(event_configuration_id);
    return { message: 'Event configuration deleted successfully.', deleted: rowsDeleted };
  }
}
