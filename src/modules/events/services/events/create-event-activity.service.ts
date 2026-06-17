import { inject, injectable } from 'tsyringe';
import IEventActivityRepositoryProvider from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import CreateOrUpdateEventActivityDTO from '../../dtos/event-activity/create-or-update-event-activity.dto';
import AppError from '../../../../shared/infra/http/errors/app-error';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import IActivityRepositoryProvider from '../../infra/orm/repositories/providers/activity-repository.provider';
import EnsureUserCanActOnOrganizationService from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import PermissionDescriptionEnum from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
export class CreateEventActivityService {
  constructor(
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepositoryProvider: IEventActivityRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepositoryProvider: IEventRepositoryProvider,
    @inject('ActivityRepositoryProvider')
    private activityRepositoryProvider: IActivityRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, data: CreateOrUpdateEventActivityDTO) {
    const [event, activity] = await Promise.all([
      (await this.eventRepositoryProvider.find({ id: data.event_id })).at(0),
      (await this.activityRepositoryProvider.find({ id: data.activity_id })).at(0),
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

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      event.organization.id,
      PermissionDescriptionEnum.EVENT_ACTIVITY_CREATE,
    );

    data.event = event;
    data.activity = activity;

    const eventActivity = await this.eventActivityRepositoryProvider.create(data);
    return { message: 'Event activity created successfully.', data: eventActivity };
  }
}
