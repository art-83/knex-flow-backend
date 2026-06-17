import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { Event } from './event.entity';
import { Activity } from './activity.entity';
import { EventActivityPresence } from './event-activity-presence.entity';
import { EventActivityInvited } from './event-activity-invited.entity';

@Entity({ name: 'event_activities' })
class EventActivity extends BaseEntitySequentialGeneratedUUID {
  @Column({ nullable: true })
  hours_to_retrieve: number;

  @Column()
  max_participants: number;

  @Column({ type: 'timestamptz' })
  start_date: Date;

  @Column({ type: 'timestamptz' })
  end_date: Date;

  @ManyToOne(() => Event, event => event.event_activities, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => Activity, activity => activity.event_activities, { nullable: false })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @OneToMany(() => EventActivityPresence, eventActivityPresence => eventActivityPresence.event_activity)
  event_activity_presences: EventActivityPresence[];

  @OneToMany(() => EventActivityInvited, eventActivityInvited => eventActivityInvited.event_activity)
  event_activity_invited: EventActivityInvited[];
}
export { EventActivity };
