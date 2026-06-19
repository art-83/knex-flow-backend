import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IEventActivityPresenceRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-presence-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { EventActivityPresenceQueryOptionsDTO } from '../../dtos/incoming/http/event-activity-presence/event-activity-presence-query-options.dto';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class FindEventActivityPresencesService {
  constructor(
    @inject('EventActivityPresenceRepositoryProvider')
    private eventActivityPresenceRepository: IEventActivityPresenceRepositoryProvider,
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, event_activity_id: string) {
    await this.ensureStaffPermission(user_id, event_activity_id);

    const presences = await this.eventActivityPresenceRepository.find({
      event_activity_id,
    } as Partial<EventActivityPresenceQueryOptionsDTO>);

    const checkedInCount = presences.filter(presence => presence.user_presence).length;

    return {
      message: 'Event activity presences retrieved successfully.',
      data: presences.map(presence => ({
        id: presence.id,
        user_id: presence.user.id,
        user_email: presence.user.email,
        user_presence: presence.user_presence,
        order_id: presence.order.id,
        order_status: presence.order.status,
        created_at: presence.created_at,
        updated_at: presence.updated_at,
      })),
      meta: {
        enrolled_count: presences.length,
        checked_in_count: checkedInCount,
      },
    };
  }

  private async ensureStaffPermission(user_id: string, event_activity_id: string) {
    const eventActivity = (await this.eventActivityRepository.find({ id: event_activity_id })).at(0);

    if (!eventActivity) {
      throw new AppError(404, 'Event activity not found.', 'Atividade de evento nao encontrada.');
    }

    const event = (await this.eventRepository.find({ id: eventActivity.event.id })).at(0);

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
  }
}
export { FindEventActivityPresencesService };
