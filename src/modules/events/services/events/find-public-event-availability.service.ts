import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { orderConfig } from '../../../../config/order.config';
import { EventActivityQueryOptionsDTO } from '../../dtos/incoming/http/event-activity/event-activity-query-options.dto';
import { BatchQueryOptionsDTO } from '../../dtos/incoming/http/batch/batch-query-options.dto';
import { TicketQueryOptionsDTO } from '../../dtos/incoming/http/ticket/ticket-query-options.dto';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventActivityPresenceRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-presence-repository.provider';
import { ITicketRepositoryProvider } from '../../infra/orm/repositories/providers/ticket-repository.provider';
import { IBatchRepositoryProvider } from '../../infra/orm/repositories/providers/batch-repository.provider';
import { EventStatus } from '../../infra/orm/enums/event-status.enum';
import { EventActivity } from '../../infra/orm/entities/event-activity.entity';
import { Batch } from '../../infra/orm/entities/batch.entity';
import { getActivityDurationHours } from '../../utils/event-activity-duration';
import { IStorageProvider } from '../../../files/infra/storage/providers/storage.provider';
import { mapStoredFile } from '../../../files/utils/map-stored-file';

@injectable()
class FindPublicEventAvailabilityService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('EventActivityPresenceRepositoryProvider')
    private eventActivityPresenceRepository: IEventActivityPresenceRepositoryProvider,
    @inject('TicketRepositoryProvider')
    private ticketRepository: ITicketRepositoryProvider,
    @inject('BatchRepositoryProvider')
    private batchRepository: IBatchRepositoryProvider,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute(event_id: string) {
    const event = (await this.eventRepository.find({ id: event_id, status: EventStatus.ACTIVE })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    const [activities, issuedTickets, batches] = await Promise.all([
      this.eventActivityRepository.find({ event_id } as Partial<EventActivityQueryOptionsDTO>),
      this.ticketRepository.find({ event_id } as Partial<TicketQueryOptionsDTO>),
      this.batchRepository.find({ event_id } as Partial<BatchQueryOptionsDTO>),
    ]);

    const participantsCounts = await Promise.all(
      activities.map(activity => this.eventActivityPresenceRepository.countByEventActivity(activity.id)),
    );

    const stock = this.resolveTicketStock(batches, issuedTickets.length);
    const lowestBatch = this.findLowestPriceBatch(batches);

    return {
      message: 'Event availability found successfully.',
      data: {
        event_id: event.id,
        pending_order_ttl_minutes: orderConfig.pendingTtlMinutes,
        tickets: {
          available_count: stock.available_tickets_count,
          total_count: stock.tickets_total,
          has_tickets: stock.has_tickets,
          lowest_price_batch: lowestBatch
            ? {
                id: lowestBatch.id,
                price: lowestBatch.price,
                base_quantity: lowestBatch.base_quantity,
              }
            : null,
        },
        activities: activities.map((activity, index) =>
          this.mapActivityAvailability(activity, participantsCounts[index] ?? 0),
        ),
      },
    };
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

  private mapActivityAvailability(eventActivity: EventActivity, participantsCount: number) {
    const maxParticipants = eventActivity.max_participants;
    const isUnlimited = maxParticipants == null;
    const spotsRemaining = isUnlimited ? null : Math.max(maxParticipants - participantsCount, 0);

    return {
      id: eventActivity.id,
      name: eventActivity.name,
      start_date: eventActivity.start_date,
      end_date: eventActivity.end_date,
      hours_to_retrieve_enabled: eventActivity.hours_to_retrieve_enabled,
      complementary_hours: eventActivity.hours_to_retrieve_enabled
        ? getActivityDurationHours(eventActivity.start_date, eventActivity.end_date)
        : null,
      max_participants: maxParticipants,
      file: mapStoredFile(this.storageProvider, eventActivity.file),
      participants_count: participantsCount,
      spots_remaining: spotsRemaining,
      is_unlimited: isUnlimited,
      is_full: !isUnlimited && participantsCount >= maxParticipants,
    };
  }
}
export { FindPublicEventAvailabilityService };
