import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateEventActivityDTO } from '../../dtos/event-activity/create-or-update-event-activity.dto';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';
import { EventActivity } from '../../infra/orm/entities/event-activity.entity';
import { IStorageProvider } from '../../../files/infra/storage/providers/storage.provider';
import { IFileRepositoryProvider } from '../../../files/infra/orm/repositories/providers/file-repository.provider';
import { FileQueryOptions } from '../../../files/dtos/file/file-query-options';
import { EventStatus } from '../../infra/orm/enums/event-status.enum';
import { getActivityDurationHours } from '../../utils/event-activity-duration';
import { mapStoredFile } from '../../../files/utils/map-stored-file';
import { OrganizationConfiguration } from '../../../users/dtos/organization/organization-configuration.dto';

@injectable()
class UpdateEventActivityService {
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
    @inject('FileRepositoryProvider')
    private fileRepository: IFileRepositoryProvider,
  ) {}

  public async execute(user_id: string, event_activity_id: string, data: Partial<CreateOrUpdateEventActivityDTO>) {
    const eventActivityExists = (await this.eventActivityRepository.find({ id: event_activity_id })).at(0);

    if (!eventActivityExists) {
      throw new AppError(404, 'Event activity not found.', 'Atividade de evento nao encontrada.');
    }

    const event = (await this.eventRepository.find({ id: eventActivityExists.event.id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    if (event.status === EventStatus.ACTIVE) {
      const config = event.organization.configuration as OrganizationConfiguration | undefined;
      const allowed = config?.can_update_event_activities_after_publish ?? false;

      if (!allowed) {
        throw new AppError(
          409,
          'Action not allowed after event is published.',
          'Acao nao permitida apos publicacao do evento.',
        );
      }
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

    const updatePayload = await this.buildUpdatePayload(user_id, data);
    const eventActivity = await this.eventActivityRepository.update(event_activity_id, updatePayload);

    return {
      message: 'Event activity updated successfully.',
      data: this.mapEventActivity(eventActivity),
    };
  }

  private mapEventActivity(eventActivity: EventActivity) {
    return {
      id: eventActivity.id,
      name: eventActivity.name,
      hours_to_retrieve_enabled: eventActivity.hours_to_retrieve_enabled,
      complementary_hours: eventActivity.hours_to_retrieve_enabled
        ? getActivityDurationHours(eventActivity.start_date, eventActivity.end_date)
        : null,
      max_participants: eventActivity.max_participants,
      start_date: eventActivity.start_date,
      end_date: eventActivity.end_date,
      file: mapStoredFile(this.storageProvider, eventActivity.file),
    };
  }

  private async buildUpdatePayload(
    user_id: string,
    data: Partial<CreateOrUpdateEventActivityDTO>,
  ): Promise<Partial<EventActivity>> {
    const { file_id, event_id, ...rest } = data;
    const updatePayload: Partial<EventActivity> = { ...rest };

    if (file_id === undefined) {
      return updatePayload;
    }

    if (file_id === null) {
      updatePayload.file = null;
      return updatePayload;
    }

    const fileQueryOptions = {
      id: file_id,
      user_id,
    } as FileQueryOptions;

    const files = await this.fileRepository.find(fileQueryOptions);
    const file = files.at(0);

    updatePayload.file = file;
    return updatePayload;
  }
}
export { UpdateEventActivityService };
