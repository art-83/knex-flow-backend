import { inject, injectable } from 'tsyringe';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class DeleteEventConfigurationService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async execute(user_id: string, event_id: string) {
    const event = (await this.eventRepository.find({ id: event_id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    if (!event.configuration) {
      throw new AppError(404, 'Event configuration not found.', 'Configuracao de evento nao encontrada.');
    }

    await this.authorizeOrganizationActionService.authorize(
      user_id,
      event.organization.id,
      PermissionDescriptionEnum.EVENT_CONFIGURATION_DELETE,
    );

    await this.eventRepository.update(event_id, { configuration: null });

    return { message: 'Event configuration deleted successfully.' };
  }
}
export { DeleteEventConfigurationService };
