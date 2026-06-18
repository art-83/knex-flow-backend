import { inject, injectable } from 'tsyringe';
import { EventActivityQueryOptions } from '../../dtos/event-activity/event-activity-query-options';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';
import { EventActivity } from '../../infra/orm/entities/event-activity.entity';
import { IStorageProvider } from '../../../files/infra/storage/providers/storage.provider';

@injectable()
class FindEventActivitiesService {
  constructor(
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
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute(user_id: string, options: Partial<EventActivityQueryOptions>) {
    if (!options.event_id) {
      throw new AppError(400, 'event_id is required.', 'event_id e obrigatorio.');
    }

    const event = (await this.eventRepository.find({ id: options.event_id })).at(0);

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

    const eventActivities = await this.eventActivityRepository.find(options);
    return {
      message: 'Event activities found successfully.',
      data: eventActivities.map(activity => this.mapEventActivity(activity)),
    };
  }

  private mapEventActivity(eventActivity: EventActivity) {
    let file = null;

    if (eventActivity.file) {
      file = {
        id: eventActivity.file.id,
        url: this.storageProvider.getPublicUrl(eventActivity.file.path),
        mime_type: eventActivity.file.mime_type,
      };
    }

    return {
      id: eventActivity.id,
      name: eventActivity.name,
      hours_to_retrieve: eventActivity.hours_to_retrieve,
      max_participants: eventActivity.max_participants,
      start_date: eventActivity.start_date,
      end_date: eventActivity.end_date,
      file,
    };
  }
}
export { FindEventActivitiesService };
