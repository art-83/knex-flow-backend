import { inject, injectable } from 'tsyringe';
import IUserOrganizationRepositoryProvider from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import IBatchRepositoryProvider from '../../infra/orm/repositories/providers/batch-repository.provider';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import ITicketRepositoryProvider from '../../infra/orm/repositories/providers/ticket-repository.provider';
import UserOrganizationQueryOptions from '../../../users/dtos/user-organization/user-organization-query-options';
import AppError from '../../../../shared/infra/http/errors/app-error';
import CreateOrUpdateBatchDTO from '../../dtos/batch/create-or-update-batch.dto';
import Ticket from '../../infra/orm/entities/ticket.entity';
import OrganizationConfiguration from '../../../users/dtos/organization/organization-configuration.dto';

// TODO: talvez transformar essa logica em uma query transacional para garantir atomicidade
@injectable()
export class CreateBatchService {
  constructor(
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('BatchRepositoryProvider')
    private batchRepository: IBatchRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('TicketRepositoryProvider')
    private ticketRepository: ITicketRepositoryProvider,
  ) {}

  public async execute(user_id: string, data: CreateOrUpdateBatchDTO) {
    const event = (await this.eventRepository.find({ id: data.event_id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    const userPermissionQueryOptions = {
      user_id: user_id,
      organization_id: event.organization.id,
    } as UserOrganizationQueryOptions;

    const userOrganization = (await this.userOrganizationRepository.find(userPermissionQueryOptions)).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'User does not have permission to create batch in this organization.',
        'Usuario nao tem permissao para criar lote nesta organizacao.',
      );
    }

    const configurationObject = userOrganization.organization.configuration as OrganizationConfiguration;

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
