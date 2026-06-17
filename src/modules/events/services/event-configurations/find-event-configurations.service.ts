import { inject, injectable } from 'tsyringe';
import EventConfigurationQueryOptions from '../../dtos/event-configuration/event-configuration-query-options';
import IEventConfigurationRepositoryProvider from '../../infra/orm/repositories/providers/event-configuration-repository.provider';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import EnsureUserCanActOnOrganizationService from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import PermissionDescriptionEnum from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
export class FindEventConfigurationsService {
  constructor(
    @inject('EventConfigurationRepositoryProvider')
    private eventConfigurationRepository: IEventConfigurationRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, options: Partial<EventConfigurationQueryOptions>) {
    if (!options.event_id) {
      throw new AppError(400, 'event_id is required.', 'event_id e obrigatorio.');
    }

    const event = (await this.eventRepository.find({ id: options.event_id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      event.organization.id,
      PermissionDescriptionEnum.EVENT_CONFIGURATION_READ,
    );

    const eventConfigurations = await this.eventConfigurationRepository.find(options);
    return { message: 'Event configurations found successfully.', data: eventConfigurations };
  }
}
