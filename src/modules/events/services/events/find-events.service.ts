import { inject, injectable } from 'tsyringe';
import { EventQueryOptions } from '../../dtos/event/event-query-options';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventActivityInvitedRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-invited-repository.provider';
import { ITicketRepositoryProvider } from '../../infra/orm/repositories/providers/ticket-repository.provider';
import { IBatchRepositoryProvider } from '../../infra/orm/repositories/providers/batch-repository.provider';
import { EventActivityQueryOptions } from '../../dtos/event-activity/event-activity-query-options';
import { EventActivityInvitedQueryOptions } from '../../dtos/event-activity-invited/event-activity-invited-query-options';
import { BatchQueryOptions } from '../../dtos/batch/batch-query-options';
import { EventActivity } from '../../infra/orm/entities/event-activity.entity';
import { IStorageProvider } from '../../../files/infra/storage/providers/storage.provider';
import { getActivityDurationHours } from '../../utils/event-activity-duration';
import { mapStoredFile } from '../../../files/utils/map-stored-file';
import { mapEventActivityInvited } from '../../utils/map-event-activity-invited';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';
import { TicketQueryOptions } from '../../dtos/ticket/ticket-query-options';
import { Batch } from '../../infra/orm/entities/batch.entity';

@injectable()
class FindEventsService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('EventActivityInvitedRepositoryProvider')
    private eventActivityInvitedRepository: IEventActivityInvitedRepositoryProvider,
    @inject('TicketRepositoryProvider')
    private ticketRepository: ITicketRepositoryProvider,
    @inject('BatchRepositoryProvider')
    private batchRepository: IBatchRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute(user_id: string, options: Partial<EventQueryOptions>) {
    if (!options.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    const userOrganization = (
      await this.userOrganizationRepository.find({ user_id, organization_id: options.organization_id })
    ).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'You do not have access to this organization.',
        'Voce nao tem acesso a esta organizacao.',
      );
    }

    const requiredPermission = (
      await this.permissionRepository.find({ description: PermissionDescriptionEnum.EVENTS_READ })
    ).at(0);

    if (!requiredPermission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const permissionGrant = (
      await this.userPermissionRepository.find({
        user_id,
        organization_id: options.organization_id,
        permission_id: requiredPermission.id,
      })
    ).at(0);

    if (!permissionGrant) {
      throw new AppError(
        403,
        'You do not have permission to perform this action.',
        'Voce nao tem permissao para realizar esta acao.',
      );
    }

    const events = await this.eventRepository.find(options);

    if (!events.length) {
      return { message: 'Events found successfully.', data: [] };
    }

    const eventIds = events.map(event => event.id);

    const [activitiesByEvent, invitedByEvent, issuedTicketsByEvent, batchesByEvent] = await Promise.all([
      Promise.all(
        eventIds.map(event_id => this.eventActivityRepository.find({ event_id } as Partial<EventActivityQueryOptions>)),
      ),
      Promise.all(
        eventIds.map(event_id =>
          this.eventActivityInvitedRepository.find({ event_id } as Partial<EventActivityInvitedQueryOptions>),
        ),
      ),
      Promise.all(
        eventIds.map(
          async event_id => (await this.ticketRepository.find({ event_id } as Partial<TicketQueryOptions>)).length,
        ),
      ),
      Promise.all(eventIds.map(event_id => this.batchRepository.find({ event_id } as Partial<BatchQueryOptions>))),
    ]);

    const response = events.map((event, index) => {
      const activities = activitiesByEvent[index] ?? [];
      const invited = invitedByEvent[index] ?? [];
      const issuedCount = issuedTicketsByEvent[index] ?? 0;
      const batches = batchesByEvent[index] ?? [];
      const stock = this.resolveTicketStock(batches, issuedCount);

      return {
        id: event.id,
        name: event.name,
        description: event.description,
        start_date: event.start_date,
        end_date: event.end_date,
        modality: event.modality,
        url_path: event.url_path,
        status: event.status,
        banner: mapStoredFile(this.storageProvider, event.banner_file),
        icon: mapStoredFile(this.storageProvider, event.icon_file),
        organization: {
          id: event.organization.id,
          name: event.organization.name,
          configuration: event.organization.configuration,
        },
        address: event.address
          ? {
              street: event.address.street,
              number: event.address.number,
              city: event.address.city,
              state: event.address.state,
              country: event.address.country,
              zip_code: event.address.zip_code,
            }
          : null,
        available_tickets_count: stock.available_tickets_count,
        activities: activities.map(activity => this.mapEventActivity(activity)),
        invited: invited.map(item => mapEventActivityInvited(this.storageProvider, item)),
      };
    });

    return { message: 'Events found successfully.', data: response };
  }

  private resolveTicketStock(batches: Batch[], issuedCount: number) {
    const ticketsTotal = batches.reduce((sum, batch) => sum + batch.base_quantity, 0);
    const availableTicketsCount = Math.max(0, ticketsTotal - issuedCount);

    return {
      tickets_total: ticketsTotal,
      available_tickets_count: availableTicketsCount,
      has_tickets: availableTicketsCount > 0,
    };
  }

  private mapEventActivity(eventActivity: EventActivity) {
    return {
      id: eventActivity.id,
      name: eventActivity.name,
      hours_to_retrieve_enabled: eventActivity.hours_to_retrieve_enabled,
      complementary_hours: eventActivity.hours_to_retrieve_enabled
        ? getActivityDurationHours(eventActivity.start_date, eventActivity.end_date)
        : null,
      max_participants: eventActivity.max_participants,
      start_date: eventActivity.start_date,
      end_date: eventActivity.end_date,
      file: mapStoredFile(this.storageProvider, eventActivity.file),
    };
  }
}
export { FindEventsService };
