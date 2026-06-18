import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateEventInvitedDTO } from '../../dtos/event-activity-invited/create-or-update-event-invited.dto';
import { IEventActivityInvitedRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-invited-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IUserRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-repository.provider';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';
import { EventActivityInvited } from '../../infra/orm/entities/event-activity-invited.entity';

@injectable()
class CreateEventInvitedService {
  constructor(
    @inject('EventActivityInvitedRepositoryProvider')
    private eventActivityInvitedRepository: IEventActivityInvitedRepositoryProvider,
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('UserRepositoryProvider')
    private userRepository: IUserRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, event_activity_id: string, data: CreateOrUpdateEventInvitedDTO) {
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

    const invitedPayload: Partial<EventActivityInvited> = {
      name: data.name,
      institution: data.institution ?? undefined,
      profession: data.profession ?? undefined,
      event_activity: eventActivity,
    };

    if (data.user_id) {
      const user = (await this.userRepository.find({ id: data.user_id })).at(0);

      if (!user) {
        throw new AppError(404, 'User not found.', 'Usuario nao encontrado.');
      }

      invitedPayload.user = user;
    }

    const invited = await this.eventActivityInvitedRepository.create(invitedPayload);

    return {
      message: 'Event invited created successfully.',
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
export { CreateEventInvitedService };
