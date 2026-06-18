import { Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { EventActivity } from './event-activity.entity';
import { User } from '../../../../users/infra/orm/entities/user.entity';

@Entity({ name: 'event_activity_presences' })
@Unique('UQ_event_activity_presences_user_activity', ['user', 'event_activity'])
class EventActivityPresence extends BaseEntitySequentialGeneratedUUID {
  @ManyToOne(() => User, user => user.event_activity_presences, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => EventActivity, eventActivity => eventActivity.event_activity_presences, { nullable: false })
  @JoinColumn({ name: 'event_activity_id' })
  event_activity: EventActivity;
}
export { EventActivityPresence };
