import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateEventConfigurationDTO } from '../../dtos/event-configuration/create-or-update-event-configuration.dto';
import { IEventConfigurationRepositoryProvider } from '../../infra/orm/repositories/providers/event-configuration-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class UpdateEventConfigurationService {
  constructor(
    @inject('EventConfigurationRepositoryProvider')
    private eventConfigurationRepository: IEventConfigurationRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async execute(
    user_id: string,
    event_configuration_id: string,
    data: Partial<CreateOrUpdateEventConfigurationDTO>,
  ) {
    const eventConfigurationExists = (await this.eventConfigurationRepository.find({ id: event_configuration_id })).at(
      0,
    );

    if (!eventConfigurationExists) {
      throw new AppError(404, 'Event configuration not found.', 'Configuracao de evento nao encontrada.');
    }

    const event = (await this.eventRepository.find({ id: eventConfigurationExists.event.id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    await this.authorizeOrganizationActionService.authorize(
      user_id,
      event.organization.id,
      PermissionDescriptionEnum.EVENT_CONFIGURATION_UPDATE,
    );

    const eventConfiguration = await this.eventConfigurationRepository.update(event_configuration_id, data);

    return { message: 'Event configuration updated successfully.', data: eventConfiguration };
  }
}
export { UpdateEventConfigurationService };
