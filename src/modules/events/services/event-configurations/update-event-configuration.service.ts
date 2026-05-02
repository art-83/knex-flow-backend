import { inject, injectable } from 'tsyringe';
import CreateOrUpdateEventConfigurationDTO from '../../dtos/event-configuration/create-or-update-event-configuration.dto';
import IEventConfigurationRepositoryProvider from '../../infra/orm/repositories/providers/event-configuration-repository.provider';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import IUserOrganizationRepositoryProvider from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import UserOrganizationQueryOptions from '../../../users/dtos/user-organization/user-organization-query-options';
import AppError from '../../../../shared/infra/http/errors/app-error';

@injectable()
export class UpdateEventConfigurationService {
  constructor(
    @inject('EventConfigurationRepositoryProvider')
    private eventConfigurationRepository: IEventConfigurationRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
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

    const userPermissionQueryOptions = {
      user_id,
      organization_id: event.organization.id,
    } as UserOrganizationQueryOptions;

    const userOrganization = (await this.userOrganizationRepository.find(userPermissionQueryOptions)).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'User does not have permission to update event configuration in this organization.',
        'Usuario nao tem permissao para atualizar configuracao de evento nesta organizacao.',
      );
    }

    const eventConfiguration = await this.eventConfigurationRepository.update(event_configuration_id, data);

    return { message: 'Event configuration updated successfully.', data: eventConfiguration };
  }
}
