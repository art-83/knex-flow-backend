import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateEventConfigurationDTO } from '../../dtos/event-configuration/create-or-update-event-configuration.dto';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class UpdateEventConfigurationService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async execute(user_id: string, event_id: string, data: Partial<CreateOrUpdateEventConfigurationDTO>) {
    const eventExists = (await this.eventRepository.find({ id: event_id })).at(0);

    if (!eventExists) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    await this.authorizeOrganizationActionService.authorize(
      user_id,
      eventExists.organization.id,
      PermissionDescriptionEnum.EVENT_CONFIGURATION_UPDATE,
    );

    const event = await this.eventRepository.update(event_id, { configuration: data.configuration });

    return { message: 'Event configuration updated successfully.', data: { configuration: event.configuration } };
  }
}
export { UpdateEventConfigurationService };
