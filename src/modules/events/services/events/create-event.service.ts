import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateEventDTO } from '../../dtos/event/create-or-update-event.dto';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IAddressRepositoryProvider } from '../../infra/orm/repositories/providers/address-repository.provider';
import { IOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/organization-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { EnsureUserCanActOnOrganizationService } from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class CreateEventService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('OrganizationRepositoryProvider')
    private organizationRepository: IOrganizationRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
    @inject('AddressRepositoryProvider')
    private addressRepository: IAddressRepositoryProvider,
  ) {}

  public async execute(user_id: string, data: CreateOrUpdateEventDTO) {
    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      data.organization_id,
      PermissionDescriptionEnum.EVENT_CREATE,
    );

    const organization = (await this.organizationRepository.find({ id: data.organization_id })).at(0);

    if (!organization) {
      throw new AppError(404, 'Organization not found.', 'Organizacao nao encontrada.');
    }

    this.validateEventDateRange(data);

    data.organization = organization;

    if (data.address) {
      const address = await this.addressRepository.create(data.address);
      data.address = address;
    }

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
export { CreateEventService };
