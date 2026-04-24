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
      throw new AppError(
        403,
        'User does not have permission to create event in this organization.',
        'Usuario nao tem permissao para criar evento nesta organizacao.',
      );
    }

    this.validateDateRange(data);

    data.organization = userOrganization.organization;

    // TODO: Criar configuração de evento

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

  private validateDateRange(data: CreateOrUpdateEventDTO) {
    if (data.start_date > data.end_date) {
      throw new AppError(400, 'Start date must be before end date.', 'Data de inicio deve ser anterior a data de fim.');
    }

    if (data.start_date < new Date()) {
      throw new AppError(400, 'Start date must be in the future.', 'Data de inicio deve estar no futuro.');
    }

    if (data.end_date < new Date()) {
      throw new AppError(400, 'End date must be in the future.', 'Data de fim deve estar no futuro.');
    }
  }
}
