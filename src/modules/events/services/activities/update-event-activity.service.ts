import { inject, injectable } from 'tsyringe';
import CreateOrUpdateEventActivityDTO from '../../dtos/event-activity/create-or-update-event-activity.dto';
import IEventActivityRepositoryProvider from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import IUserOrganizationRepositoryProvider from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import UserOrganizationQueryOptions from '../../../users/dtos/user-organization/user-organization-query-options';
import AppError from '../../../../shared/infra/http/errors/app-error';

@injectable()
export class UpdateEventActivityService {
  constructor(
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
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

    const userPermissionQueryOptions = {
      user_id,
      organization_id: event.organization.id,
    } as UserOrganizationQueryOptions;

    const userOrganization = (await this.userOrganizationRepository.find(userPermissionQueryOptions)).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'User does not have permission to update event activity in this organization.',
        'Usuario nao tem permissao para atualizar atividade de evento nesta organizacao.',
      );
    }

    const eventActivity = await this.eventActivityRepository.update(event_activity_id, data);
    return { message: 'Event activity updated successfully.', data: eventActivity };
  }
}
