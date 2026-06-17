import { inject, injectable } from 'tsyringe';
import { EventActivityQueryOptions } from '../../dtos/event-activity/event-activity-query-options';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class FindEventActivitiesService {
  constructor(
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async execute(user_id: string, options: Partial<EventActivityQueryOptions>) {
    if (!options.event_id) {
      throw new AppError(400, 'event_id is required.', 'event_id e obrigatorio.');
    }

    const event = (await this.eventRepository.find({ id: options.event_id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    await this.authorizeOrganizationActionService.authorize(
      user_id,
      event.organization.id,
      PermissionDescriptionEnum.EVENT_ACTIVITY_READ,
    );

    const eventActivities = await this.eventActivityRepository.find(options);
    return { message: 'Event activities found successfully.', data: eventActivities };
  }
}
export { FindEventActivitiesService };
