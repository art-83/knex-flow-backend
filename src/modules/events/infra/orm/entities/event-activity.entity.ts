import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { File } from '../../../../files/infra/orm/entities/file.entity';
import { Event } from './event.entity';
import { EventActivityPresence } from './event-activity-presence.entity';
import { EventActivityInvited } from './event-activity-invited.entity';

@Entity({ name: 'event_activities' })
class EventActivity extends BaseEntitySequentialGeneratedUUID {
  @Column()
  name: string;

  @Column({ type: 'boolean', default: false })
  hours_to_retrieve_enabled: boolean;

  @Column({ type: 'integer', nullable: true })
  max_participants: number | null;

  @Column({ type: 'timestamptz' })
  start_date: Date;

  @Column({ type: 'timestamptz' })
  end_date: Date;

  @ManyToOne(() => Event, event => event.event_activities, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @ManyToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'file_id' })
  file: File | null;

  @OneToMany(() => EventActivityPresence, eventActivityPresence => eventActivityPresence.event_activity)
  event_activity_presences: EventActivityPresence[];

  @OneToMany(() => EventActivityInvited, eventActivityInvited => eventActivityInvited.event_activity)
  event_activity_invited: EventActivityInvited[];
}
export { EventActivity };
