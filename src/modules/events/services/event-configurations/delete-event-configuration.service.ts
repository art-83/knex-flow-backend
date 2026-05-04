import { inject, injectable } from 'tsyringe';
import IEventConfigurationRepositoryProvider from '../../infra/orm/repositories/providers/event-configuration-repository.provider';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import EnsureUserCanActOnOrganizationService from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import PermissionDescriptionEnum from '../../../users/enums/permission-description.enum';

@injectable()
export class DeleteEventConfigurationService {
  constructor(
    @inject('EventConfigurationRepositoryProvider')
    private eventConfigurationRepository: IEventConfigurationRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, event_configuration_id: string) {
    const eventConfiguration = (await this.eventConfigurationRepository.find({ id: event_configuration_id })).at(0);

    if (!eventConfiguration) {
      throw new AppError(404, 'Event configuration not found.', 'Configuracao de evento nao encontrada.');
    }

    const event = (await this.eventRepository.find({ id: eventConfiguration.event.id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      event.organization.id,
      PermissionDescriptionEnum.EVENT_CONFIGURATION_DELETE,
    );

    const rowsDeleted = await this.eventConfigurationRepository.delete(event_configuration_id);
    return { message: 'Event configuration deleted successfully.', deleted: rowsDeleted };
  }
}
