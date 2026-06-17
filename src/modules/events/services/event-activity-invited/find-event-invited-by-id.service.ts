import { inject, injectable } from 'tsyringe';
import { IEventActivityInvitedRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-invited-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';
import { EventActivityInvited } from '../../infra/orm/entities/event-activity-invited.entity';

@injectable()
class FindEventInvitedByIdService {
  constructor(
    @inject('EventActivityInvitedRepositoryProvider')
    private eventActivityInvitedRepository: IEventActivityInvitedRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, invited_id: string) {
    const invited = (await this.eventActivityInvitedRepository.find({ id: invited_id })).at(0);

    if (!invited) {
      throw new AppError(404, 'Event invited not found.', 'Convidado nao encontrado.');
    }

    const event = (await this.eventRepository.find({ id: invited.event_activity.event.id })).at(0);

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
      await this.permissionRepository.find({ description: PermissionDescriptionEnum.EVENTS_READ })
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

    return {
      message: 'Event invited found successfully.',
      data: this.mapInvited(invited),
    };
  }

  private mapInvited(invited: EventActivityInvited) {
    return {
      id: invited.id,
      event_activity_id: invited.event_activity.id,
      name: invited.name,
      institution: invited.institution,
      profession: invited.profession,
      user_id: invited.user?.id ?? null,
    };
  }
}
export { FindEventInvitedByIdService };
