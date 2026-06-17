import { inject, injectable } from 'tsyringe';
import IBatchRepositoryProvider from '../../infra/orm/repositories/providers/batch-repository.provider';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import ITicketRepositoryProvider from '../../infra/orm/repositories/providers/ticket-repository.provider';
import IOrganizationRepositoryProvider from '../../../users/infra/orm/repositories/providers/organization-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import CreateOrUpdateBatchDTO from '../../dtos/batch/create-or-update-batch.dto';
import Ticket from '../../infra/orm/entities/ticket.entity';
import OrganizationConfiguration from '../../../users/dtos/organization/organization-configuration.dto';
import EnsureUserCanActOnOrganizationService from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import PermissionDescriptionEnum from '../../../users/infra/orm/enums/permission-description.enum';

// TODO: talvez transformar essa logica em uma query transacional para garantir atomicidade
@injectable()
export class CreateBatchService {
  constructor(
    @inject('OrganizationRepositoryProvider')
    private organizationRepository: IOrganizationRepositoryProvider,
    @inject('BatchRepositoryProvider')
    private batchRepository: IBatchRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('TicketRepositoryProvider')
    private ticketRepository: ITicketRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, data: CreateOrUpdateBatchDTO) {
    const event = (await this.eventRepository.find({ id: data.event_id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      event.organization.id,
      PermissionDescriptionEnum.BATCH_CREATE,
    );

    const organization = (await this.organizationRepository.find({ id: event.organization.id })).at(0);

    if (!organization) {
      throw new AppError(404, 'Organization not found.', 'Organizacao nao encontrada.');
    }

    const configurationObject = organization.configuration as OrganizationConfiguration;

    if (
      configurationObject &&
      configurationObject.max_batch_base_quantity &&
      data.base_quantity > configurationObject.max_batch_base_quantity
    ) {
      throw new AppError(
        400,
        'Batch base quantity exceeds the maximum allowed by the organization.',
        'Quantidade base do lote excede o maximo permitido pela organizacao.',
      );
    }

    data.event = event;

    const batch = await this.batchRepository.create(data);

    const ticketToCreate = Array.from({ length: data.base_quantity }).map(
      () =>
        ({
          batch: batch,
        }) as Ticket,
    );

    const createBatchTickets = await this.ticketRepository.createMany(ticketToCreate);

    const response = {
      message: 'Batch created successfully.',
      batch: {
        id: batch.id,
        price: batch.price,
        base_quantity: batch.base_quantity,
      },
      tickets_created: createBatchTickets.length,
    };

    return response;
  }
}
