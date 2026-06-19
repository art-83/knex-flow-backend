import { inject, injectable } from 'tsyringe';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { EventStatus } from '../../infra/orm/enums/event-status.enum';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IBatchRepositoryProvider } from '../../infra/orm/repositories/providers/batch-repository.provider';
import { BatchQueryOptionsDTO } from '../../dtos/incoming/http/batch/batch-query-options.dto';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { Batch } from '../../infra/orm/entities/batch.entity';

@injectable()
class PublishEventService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('BatchRepositoryProvider')
    private batchRepository: IBatchRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, event_id: string) {
    const event = (await this.eventRepository.find({ id: event_id })).at(0);

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
      await this.permissionRepository.find({ description: PermissionDescriptionEnum.EVENTS_MANAGE })
    ).at(0);

    if (!requiredPermission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const userPermission = (
      await this.userPermissionRepository.find({
        user_id,
        organization_id: event.organization.id,
        permission_id: requiredPermission.id,
      })
    ).at(0);

    if (!userPermission) {
      throw new AppError(
        403,
        'You do not have permission to perform this action.',
        'Voce nao tem permissao para realizar esta acao.',
      );
    }

    if (event.status !== EventStatus.DRAFT) {
      throw new AppError(400, 'Event is not draft.', 'Evento nao esta em draft.');
    }

    event.status = EventStatus.ACTIVE;
    await this.eventRepository.update(event_id, event);

    const batches = await this.batchRepository.find({ event_id: event.id } as BatchQueryOptionsDTO);

    return {
      message: 'Event published successfully.',
      data: {
        event_id,
        status: EventStatus.ACTIVE,
        capacity_total: this.resolveTotalCapacity(batches),
      },
    };
  }

  private resolveTotalCapacity(batches: Batch[]): number {
    return batches.reduce((sum, batch) => sum + batch.base_quantity, 0);
  }
}
export { PublishEventService };
