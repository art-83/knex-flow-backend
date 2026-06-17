import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateEventInvitedDTO } from '../../dtos/event-activity-invited/create-or-update-event-invited.dto';
import { IEventActivityInvitedRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-invited-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IUserRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-repository.provider';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
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
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
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

    await this.authorizeOrganizationActionService.authorize(
      user_id,
      event.organization.id,
      PermissionDescriptionEnum.EVENT_INVITED_CREATE,
    );

    const invitedPayload: Partial<EventActivityInvited> = {
      name: data.name,
      institution: data.institution,
      profession: data.profession,
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
