import { inject, injectable } from 'tsyringe';
import { EventQueryOptions } from '../../dtos/event/event-query-options';
import { PublicEventQueryOptions } from '../../dtos/event/public-event-query-options';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventActivityInvitedRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-invited-repository.provider';
import { ITicketRepositoryProvider } from '../../infra/orm/repositories/providers/ticket-repository.provider';
import { IBatchRepositoryProvider } from '../../infra/orm/repositories/providers/batch-repository.provider';
import { EventActivityQueryOptions } from '../../dtos/event-activity/event-activity-query-options';
import { EventActivityInvitedQueryOptions } from '../../dtos/event-activity-invited/event-activity-invited-query-options';
import { EventActivity } from '../../infra/orm/entities/event-activity.entity';
import { EventActivityInvited } from '../../infra/orm/entities/event-activity-invited.entity';
import { Event } from '../../infra/orm/entities/event.entity';
import { Address } from '../../infra/orm/entities/address.entity';
import { BatchQueryOptions } from '../../dtos/batch/batch-query-options';
import { IStorageProvider } from '../../../files/infra/storage/providers/storage.provider';
import { getActivityDurationHours } from '../../utils/event-activity-duration';
import { mapStoredFile } from '../../../files/utils/map-stored-file';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { EventStatus } from '../../infra/orm/enums/event-status.enum';
import { TicketQueryOptions } from '../../dtos/ticket/ticket-query-options';
import { Batch } from '../../infra/orm/entities/batch.entity';

@injectable()
class FindPublicEventsService {
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
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute(options: Partial<PublicEventQueryOptions>) {
    const events = await this.eventRepository.find({
      ...(options as Partial<EventQueryOptions>),
      status: EventStatus.ACTIVE,
    });

    if (options.id) {
      const event = events.at(0);
      if (!event) {
        throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
      }
      const [mapped] = await this.mapEvents([event]);
      return { message: 'Event found successfully.', data: mapped };
    }

    const data = await this.mapEvents(events);
    return { message: 'Events found successfully.', data };
  }

  private async mapEvents(events: Event[]) {
    if (!events.length) return [];

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

    return events.map((event, index) => {
      const activities = activitiesByEvent[index] ?? [];
      const invited = invitedByEvent[index] ?? [];
      const issuedCount = issuedTicketsByEvent[index] ?? 0;
      const batches = batchesByEvent[index] ?? [];
      const stock = this.resolveTicketStock(batches, issuedCount);
      const lowestBatch = this.findLowestPriceBatch(batches);

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
        },
        address: event.address ? this.mapAddress(event.address) : null,
        available_tickets_count: stock.available_tickets_count,
        tickets_total: stock.tickets_total,
        batch: lowestBatch
          ? {
              id: lowestBatch.id,
              price: lowestBatch.price,
              base_quantity: lowestBatch.base_quantity,
            }
          : null,
        activities: activities.map(activity => this.mapEventActivity(activity)),
        invited: invited.map(item => this.mapInvited(item)),
      };
    });
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

  private findLowestPriceBatch(batches: Batch[]): Batch | null {
    if (!batches.length) return null;
    return batches.reduce((lowest, batch) => (batch.price < lowest.price ? batch : lowest));
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

  private mapAddress(address: Address) {
    return {
      street: address.street,
      number: address.number,
      city: address.city,
      state: address.state,
      country: address.country,
      zip_code: address.zip_code,
    };
  }

  private mapInvited(invited: EventActivityInvited) {
    return {
      id: invited.id,
      event_activity_id: invited.event_activity.id,
      name: invited.name,
      institution: invited.institution,
      profession: invited.profession,
      user_id: invited.user?.id ?? null,
    };
  }
}
export { FindPublicEventsService };
