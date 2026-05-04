import { inject, injectable } from 'tsyringe';
import EventQueryOptions from '../../dtos/event/event-query-options';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import EnsureUserCanActOnOrganizationService from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import PermissionDescriptionEnum from '../../../users/enums/permission-description.enum';

@injectable()
export class FindEventsService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, options: Partial<EventQueryOptions>) {
    if (!options.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      options.organization_id,
      PermissionDescriptionEnum.EVENT_READ,
    );

    const events = await this.eventRepository.find(options);
    return { message: 'Events found successfully.', data: events };
  }
}
