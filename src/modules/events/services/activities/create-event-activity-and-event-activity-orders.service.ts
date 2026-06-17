import { inject, injectable } from 'tsyringe';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IActivityRepositoryProvider } from '../../infra/orm/repositories/providers/activity-repository.provider';
import { CreateOrUpdateEventActivityDTO } from '../../dtos/event-activity/create-or-update-event-activity.dto';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { Event } from '../../infra/orm/entities/event.entity';
import { EventActivityPresence } from '../../infra/orm/entities/event-activity-presence.entity';
import { IEventActivityOrderRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-order-repository.provider';
import { EnsureUserCanActOnOrganizationService } from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
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
    @inject('EventActivityOrderRepositoryProvider')
    private eventActivityOrderRepository: IEventActivityOrderRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
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

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      event.organization.id,
      PermissionDescriptionEnum.EVENT_ACTIVITY_CREATE,
    );

    this.validateEventActivityDateRange(data, event);

    data.event = event;
    data.activity = activity;

    const eventActivity = await this.eventActivityRepository.create(data);

    const eventActivityOrders = Array.from({ length: data.max_participants }).map(
      () =>
        ({
          event_activity: eventActivity,
        }) as EventActivityPresence,
    );

    await this.eventActivityOrderRepository.createMany(eventActivityOrders);

    return {
      message: 'Event activity created successfully.',
      event_activity: {
        id: eventActivity.id,
        hours_to_retrieve: eventActivity.hours_to_retrieve,
        max_participants: eventActivity.max_participants,
        start_date: eventActivity.start_date,
        end_date: eventActivity.end_date,
      },
      event_activity_orders_created: eventActivityOrders.length,
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
