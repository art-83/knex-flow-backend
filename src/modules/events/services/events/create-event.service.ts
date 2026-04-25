import { inject, injectable } from 'tsyringe';
import CreateOrUpdateEventDTO from '../../dtos/event/create-or-update-event.dto';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import IUserOrganizationRepositoryProvider from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import UserOrganizationQueryOptions from '../../../users/dtos/user-organization/user-organization-query-options';

@injectable()
export class CreateEventService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
  ) {}

  public async execute(user_id: string, data: CreateOrUpdateEventDTO) {
    const userPermissionQueryOptions = {
      user_id: user_id,
      organization_id: data.organization_id,
    } as UserOrganizationQueryOptions;

    const userOrganization = (await this.userOrganizationRepository.find(userPermissionQueryOptions)).at(0);

    if (!userOrganization) {
      throw new AppError(403, 'User does not have permission to create event in this organization.');
    }

    this.validateEventDateRange(data);

    data.organization = userOrganization.organization;

    // TODO: Criar configuração de evento, ainda definir regras de negócio

    const event = await this.eventRepository.create(data);
    return {
      message: 'Event created successfully.',
      event: {
        id: event.id,
        name: event.name,
        description: event.description,
      },
    };
  }

  private validateEventDateRange(data: CreateOrUpdateEventDTO) {
    if (data.start_date > data.end_date) {
      throw new AppError(400, 'Start date must be before end date.');
    }

    if (data.start_date < new Date()) {
      throw new AppError(400, 'Start date must be in the future.');
    }

    if (data.end_date < new Date()) {
      throw new AppError(400, 'End date must be in the future.');
    }
  }
}
