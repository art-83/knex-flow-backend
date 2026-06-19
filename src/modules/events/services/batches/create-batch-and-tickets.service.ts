import { inject, injectable } from 'tsyringe';
import { IBatchRepositoryProvider } from '../../infra/orm/repositories/providers/batch-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/organization-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { CreateOrUpdateBatchDTO } from '../../dtos/batch/create-or-update-batch.dto';
import { OrganizationConfiguration } from '../../../users/dtos/organization/organization-configuration.dto';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';
import { EventStatus } from '../../infra/orm/enums/event-status.enum';

@injectable()
class CreateBatchService {
  constructor(
    @inject('OrganizationRepositoryProvider')
    private organizationRepository: IOrganizationRepositoryProvider,
    @inject('BatchRepositoryProvider')
    private batchRepository: IBatchRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, data: CreateOrUpdateBatchDTO) {
    const event = (await this.eventRepository.find({ id: data.event_id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    const userOrganization = (
      await this.userOrganizationRepository.find({ user_id, organization_id: event.organization.id })
    ).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'You do not have access to this organization.',
        'Voce nao tem acesso a esta organizacao.',
      );
    }

    const requiredPermission = (
      await this.permissionRepository.find({ description: PermissionDescriptionEnum.BATCHES_MANAGE })
    ).at(0);

    if (!requiredPermission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const permissionGrant = (
      await this.userPermissionRepository.find({
        user_id,
        organization_id: event.organization.id,
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

    if (event.status === EventStatus.ACTIVE) {
      const config = event.organization.configuration as OrganizationConfiguration | undefined;
      const allowed = config?.can_create_batches_after_publish ?? true;

      if (!allowed) {
        throw new AppError(
          409,
          'Action not allowed after event is published.',
          'Acao nao permitida apos publicacao do evento.',
        );
      }
    }

    const organization = (await this.organizationRepository.find({ id: event.organization.id })).at(0);

    if (!organization) {
      throw new AppError(404, 'Organization not found.', 'Organizacao nao encontrada.');
    }

    const configurationObject = organization.configuration as OrganizationConfiguration | undefined;

    if (
      configurationObject?.max_batch_base_quantity &&
      data.base_quantity > configurationObject.max_batch_base_quantity
    ) {
      throw new AppError(
        400,
        'Batch base quantity exceeds the maximum allowed by the organization.',
        'Quantidade base do lote excede o maximo permitido pela organizacao.',
      );
    }

    data.event = event;

    const batch = await this.batchRepository.create(data);

    return {
      message: 'Batch created successfully.',
      batch: {
        id: batch.id,
        price: batch.price,
        base_quantity: batch.base_quantity,
      },
    };
  }
}
export { CreateBatchService };
