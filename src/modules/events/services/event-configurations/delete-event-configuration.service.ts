import { inject, injectable } from 'tsyringe';
import IEventConfigurationRepositoryProvider from '../../infra/orm/repositories/providers/event-configuration-repository.provider';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import IUserOrganizationRepositoryProvider from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import UserOrganizationQueryOptions from '../../../users/dtos/user-organization/user-organization-query-options';
import AppError from '../../../../shared/infra/http/errors/app-error';

@injectable()
export class DeleteEventConfigurationService {
  constructor(
    @inject('EventConfigurationRepositoryProvider')
    private eventConfigurationRepository: IEventConfigurationRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
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

    const userPermissionQueryOptions = {
      user_id,
      organization_id: event.organization.id,
    } as UserOrganizationQueryOptions;

    const userOrganization = (await this.userOrganizationRepository.find(userPermissionQueryOptions)).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'User does not have permission to delete event configuration in this organization.',
        'Usuario nao tem permissao para deletar configuracao de evento nesta organizacao.',
      );
    }

    const rowsDeleted = await this.eventConfigurationRepository.delete(event_configuration_id);
    return { message: 'Event configuration deleted successfully.', deleted: rowsDeleted };
  }
}
