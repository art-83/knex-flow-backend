import { Repository } from 'typeorm';
import { dataSource } from '../../../../../../shared/infra/orm/database';
import { EventActivityPresenceQueryOptionsDTO } from '../../../../dtos/incoming/http/event-activity-presence/event-activity-presence-query-options.dto';
import { MarkPresenceCheckInOutcomeStatus } from '../../enums/mark-presence-check-in-outcome-status.enum';
import { MarkPresenceCheckInDTO } from '../../../../dtos/internal/repositories/mark-presence-check-in.dto';
import { MarkPresenceCheckInOutcomeDTO } from '../../../../dtos/internal/repositories/mark-presence-check-in-outcome.dto';
import { EventActivityPresence } from '../../entities/event-activity-presence.entity';
import { OrderStatus } from '../../enums/order-status.enum';
import { IEventActivityPresenceRepositoryProvider } from '../providers/event-activity-presence-repository.provider';

class EventActivityPresenceRepository implements IEventActivityPresenceRepositoryProvider {
  private repository: Repository<EventActivityPresence>;

  constructor() {
    this.repository = dataSource.getRepository(EventActivityPresence);
  }

  public async find(data: Partial<EventActivityPresenceQueryOptionsDTO>): Promise<EventActivityPresence[]> {
    const query = this.repository.createQueryBuilder('event_activity_presence');

    query.leftJoinAndSelect('event_activity_presence.user', 'user');
    query.leftJoinAndSelect('event_activity_presence.event_activity', 'event_activity');
    query.leftJoinAndSelect('event_activity_presence.order', 'order');

    if (data.id) query.andWhere('event_activity_presence.id = :id', { id: data.id });

    if (data.event_activity_id) {
      query.andWhere('event_activity_presence.event_activity_id = :event_activity_id', {
        event_activity_id: data.event_activity_id,
      });
    }

    if (data.user_id) {
      query.andWhere('event_activity_presence.user_id = :user_id', { user_id: data.user_id });
    }

    if (data.order_id) {
      query.andWhere('event_activity_presence.order_id = :order_id', { order_id: data.order_id });
    }

    if (data.limit) query.limit(data.limit);
    if (data.offset) query.offset(data.offset);

    return await query.getMany();
  }

  public async countByEventActivity(event_activity_id: string): Promise<number> {
    return this.repository.count({ where: { event_activity: { id: event_activity_id } } });
  }

  public async create(data: Partial<EventActivityPresence>): Promise<EventActivityPresence> {
    const create = this.repository.create(data);
    return await this.repository.save(create);
  }

  public async update(id: string, data: Partial<EventActivityPresence>): Promise<EventActivityPresence> {
    const create = this.repository.create(data);
    await this.repository.update(id, create);
    return create;
  }

  public async delete(id: string): Promise<number> {
    const deleteResult = await this.repository.softDelete(id);
    return Number(deleteResult.affected);
  }

  public async deleteByOrderId(order_id: string): Promise<void> {
    await this.repository.delete({ order: { id: order_id } });
  }

  public async markPresenceCheckIn(data: MarkPresenceCheckInDTO): Promise<MarkPresenceCheckInOutcomeDTO> {
    return dataSource.transaction(async manager => {
      const presence = await manager
        .createQueryBuilder(EventActivityPresence, 'presence')
        .innerJoinAndSelect('presence.order', 'order')
        .innerJoinAndSelect('presence.event_activity', 'event_activity')
        .innerJoinAndSelect('presence.user', 'user')
        .where('presence.id = :id', { id: data.presence_id })
        .setLock('pessimistic_write')
        .getOne();

      if (!presence) {
        return { status: MarkPresenceCheckInOutcomeStatus.NOT_FOUND };
      }

      if (presence.event_activity.id !== data.event_activity_id || presence.user.id !== data.user_id) {
        return { status: MarkPresenceCheckInOutcomeStatus.MISMATCH };
      }

      if (presence.order.status !== OrderStatus.CONFIRMED) {
        return { status: MarkPresenceCheckInOutcomeStatus.ORDER_NOT_CONFIRMED };
      }

      if (presence.user_presence) {
        return { status: MarkPresenceCheckInOutcomeStatus.ALREADY_CHECKED_IN };
      }

      const updateResult = await manager
        .createQueryBuilder()
        .update(EventActivityPresence)
        .set({ user_presence: true })
        .where('id = :id', { id: data.presence_id })
        .andWhere('user_presence = :userPresence', { userPresence: false })
        .execute();

      if (!updateResult.affected) {
        return { status: MarkPresenceCheckInOutcomeStatus.ALREADY_CHECKED_IN };
      }

      const updatedPresence = await manager.findOne(EventActivityPresence, {
        where: { id: data.presence_id },
        relations: ['order', 'event_activity', 'user'],
      });

      if (!updatedPresence) {
        return { status: MarkPresenceCheckInOutcomeStatus.NOT_FOUND };
      }

      return { status: MarkPresenceCheckInOutcomeStatus.SUCCESS, presence: updatedPresence };
    });
  }
}
export { EventActivityPresenceRepository };
