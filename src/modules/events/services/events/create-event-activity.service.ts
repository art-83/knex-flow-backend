import { inject } from 'tsyringe';
import IEventActivityRepositoryProvider from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import CreateOrUpdateEventActivityDTO from '../../dtos/event-activity/create-or-update-event-activity.dto';
import UserOrganizationQueryOptions from '../../../users/dtos/user-organization/user-organization-query-options';
import AppError from '../../../../shared/infra/http/errors/app-error';
import IUserOrganizationRepositoryProvider from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import IActivityRepositoryProvider from '../../infra/orm/repositories/providers/activity-repository.provider';

export class CreateEventActivityService {
  constructor(
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepositoryProvider: IUserOrganizationRepositoryProvider,
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepositoryProvider: IEventActivityRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepositoryProvider: IEventRepositoryProvider,
    @inject('ActivityRepositoryProvider')
    private activityRepositoryProvider: IActivityRepositoryProvider,
  ) {}

  public async execute(user_id: string, data: CreateOrUpdateEventActivityDTO) {
    const [event, activity] = await Promise.all([
      (await this.eventRepositoryProvider.find({ id: data.event_id })).at(0),
      (await this.activityRepositoryProvider.find({ id: data.activity_id })).at(0),
    ]);

    if (!event) {
      throw new AppError(404, 'Event not found.');
    }

    if (!activity) {
      throw new AppError(404, 'Activity not found.');
    }

    if (event.organization.id !== activity.organization.id) {
      throw new AppError(403, 'Activity does not belong to the same organization as the event.');
    }

    const userOrganizationQuery = {
      user_id: user_id,
      organization_id: event.organization.id,
    } as UserOrganizationQueryOptions;

    const userOrganization = (await this.userOrganizationRepositoryProvider.find(userOrganizationQuery)).at(0);

    if (!userOrganization) {
      throw new AppError(403, 'User does not have permission to create event activity in this organization.');
    }

    data.event = event;
    data.activity = activity;

    const eventActivity = await this.eventActivityRepositoryProvider.create(data);
    return { message: 'Event activity created successfully.', data: eventActivity };
  }
}
