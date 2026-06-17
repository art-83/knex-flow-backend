import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateEventInvitedDTO } from '../../dtos/event-activity-invited/create-or-update-event-invited.dto';
import { IEventActivityInvitedRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-invited-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization/authorize-organization-action.service';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { EventActivityInvited } from '../../infra/orm/entities/event-activity-invited.entity';
import { EventActivity } from '../../infra/orm/entities/event-activity.entity';

@injectable()
class CreateEventInvitedService {
  constructor(
    @inject('EventActivityInvitedRepositoryProvider')
    private eventActivityInvitedRepository: IEventActivityInvitedRepositoryProvider,
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async execute(user_id: string, data: CreateOrUpdateEventInvitedDTO) {
    const eventActivity = (await this.eventActivityRepository.find({ id: data.event_activity_id })).at(0);
    if (!eventActivity) {
      throw new AppError(404, 'Event activity not found.', 'Atividade de evento nao encontrada.');
    }

    await this.authorizeOrganizationActionService.authorize(
      user_id,
      eventActivity.event.organization.id,
      PermissionDescriptionEnum.EVENT_INVITED_CREATE,
    );

    const invitedUser = await this.createOrGetInvitedUser(data, eventActivity);

    if (!invitedUser) {
      throw new AppError(404, 'Invited user not found.', 'Usuario convidado nao encontrado.');
    }

    return {
      message: 'Event invited created successfully.',
      data: invitedUser,
    };
  }

  private async createOrGetInvitedUser(
    data: CreateOrUpdateEventInvitedDTO,
    eventActivity: EventActivity,
  ): Promise<EventActivityInvited> {
    if (data.user_id) {
      const invitedUser = (await this.eventActivityInvitedRepository.find({ id: data.user_id })).at(0);
      if (!invitedUser) {
        throw new AppError(404, 'Invited user not found.', 'Usuario convidado nao encontrado.');
      }
      return invitedUser;
    }
    data.event_activity = eventActivity;
    return this.eventActivityInvitedRepository.create(data);
  }
}
export { CreateEventInvitedService };
