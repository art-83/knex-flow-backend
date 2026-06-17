import { inject, injectable } from 'tsyringe';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IActivityRepositoryProvider } from '../../infra/orm/repositories/providers/activity-repository.provider';
import { CreateOrUpdateEventActivityDTO } from '../../dtos/event-activity/create-or-update-event-activity.dto';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { Event } from '../../infra/orm/entities/event.entity';
import { EventActivityPresence } from '../../infra/orm/entities/event-activity-presence.entity';
import { IEventActivityPresenceRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-presence-repository.provider';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class CreateEventActivityService {
  constructor(
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('ActivityRepositoryProvider')
    private activityRepository: IActivityRepositoryProvider,
    @inject('EventActivityPresenceRepositoryProvider')
    private eventActivityPresenceRepository: IEventActivityPresenceRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, event_id: string, data: CreateOrUpdateEventActivityDTO) {
    const [event, activity] = await Promise.all([
      (await this.eventRepository.find({ id: event_id })).at(0),
      (await this.activityRepository.find({ id: data.activity_id })).at(0),
    ]);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    if (!activity) {
      throw new AppError(404, 'Activity not found.', 'Atividade nao encontrada.');
    }

    if (event.organization.id !== activity.organization.id) {
      throw new AppError(
        403,
        'Activity does not belong to the same organization as the event.',
        'Atividade nao pertence a mesma organizacao do evento.',
      );
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

    this.validateEventActivityDateRange(data, event);

    data.event = event;
    data.activity = activity;

    const eventActivity = await this.eventActivityRepository.create(data);

    const eventActivityPresences = Array.from({ length: data.max_participants }).map(
      () =>
        ({
          event_activity: eventActivity,
        }) as EventActivityPresence,
    );

    await this.eventActivityPresenceRepository.createMany(eventActivityPresences);

    return {
      message: 'Event activity created successfully.',
      event_activity: {
        id: eventActivity.id,
        hours_to_retrieve: eventActivity.hours_to_retrieve,
        max_participants: eventActivity.max_participants,
        start_date: eventActivity.start_date,
        end_date: eventActivity.end_date,
      },
      event_activity_presences_created: eventActivityPresences.length,
    };
  }

  private validateEventActivityDateRange(eventActivity: CreateOrUpdateEventActivityDTO, targetEvent: Event) {
    if (eventActivity.start_date > eventActivity.end_date) {
      throw new AppError(
        400,
        'Start date must be before end date in event activity creation.',
        'Data de inicio deve ser anterior a data de fim na criacao da atividade do evento.',
      );
    }

    if (eventActivity.start_date < targetEvent.start_date || eventActivity.end_date > targetEvent.end_date) {
      throw new AppError(
        400,
        'Activity date range must be within the event date range.',
        'Periodo da atividade deve estar dentro do periodo do evento.',
      );
    }
  }
}
export { CreateEventActivityService };
