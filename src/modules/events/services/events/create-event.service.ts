import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateEventDTO } from '../../dtos/event/create-or-update-event.dto';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IAddressRepositoryProvider } from '../../infra/orm/repositories/providers/address-repository.provider';
import { IOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/organization-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';
import { EventStatus } from '../../infra/orm/enums/event-status.enum';

@injectable()
class CreateEventService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('OrganizationRepositoryProvider')
    private organizationRepository: IOrganizationRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
    @inject('AddressRepositoryProvider')
    private addressRepository: IAddressRepositoryProvider,
  ) {}

  public async execute(user_id: string, data: CreateOrUpdateEventDTO) {
    if (data.url_path) {
      const possibleExistingEvent = (
        await this.eventRepository.find({ url_path: data.url_path, status: EventStatus.ACTIVE })
      ).at(0);

      if (possibleExistingEvent) {
        throw new AppError(400, 'Event with this URL path already exists.', 'Evento com este caminho URL ja existe.');
      }
    }

    const userOrganization = (
      await this.userOrganizationRepository.find({ user_id, organization_id: data.organization_id })
    ).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'You do not have access to this organization.',
        'Voce nao tem acesso a esta organizacao.',
      );
    }

    const requiredPermission = (
      await this.permissionRepository.find({ description: PermissionDescriptionEnum.EVENTS_MANAGE })
    ).at(0);

    if (!requiredPermission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const permissionGrant = (
      await this.userPermissionRepository.find({
        user_id,
        organization_id: data.organization_id,
        permission_id: requiredPermission.id,
      })
    ).at(0);

    if (!permissionGrant) {
      throw new AppError(
        403,
        'You do not have permission to perform this action.',
        'Voce nao tem permissao para realizar esta acao.',
      );
    }

    const organization = (await this.organizationRepository.find({ id: data.organization_id })).at(0);

    if (!organization) {
      throw new AppError(404, 'Organization not found.', 'Organizacao nao encontrada.');
    }

    this.validateEventDateRange(data);

    data.organization = organization;
    data.status = data.status ?? EventStatus.DRAFT;

    if (data.address) {
      const address = await this.addressRepository.create(data.address);
      data.address = address;
    }

    const event = await this.eventRepository.create(data);
    return {
      message: 'Event created successfully.',
      event: {
        id: event.id,
        name: event.name,
        description: event.description,
        url_path: event.url_path,
        status: event.status,
        address: event.address,
      },
    };
  }

  private validateEventDateRange(data: CreateOrUpdateEventDTO) {
    if (data.start_date > data.end_date) {
      throw new AppError(400, 'Start date must be before end date.', 'Data de inicio deve ser anterior a data de fim.');
    }

    if (data.start_date < new Date()) {
      throw new AppError(400, 'Start date must be in the future.', 'Data de inicio deve estar no futuro.');
    }

    if (data.end_date < new Date()) {
      throw new AppError(400, 'End date must be in the future.', 'Data de fim deve estar no futuro.');
    }
  }
}
export { CreateEventService };
