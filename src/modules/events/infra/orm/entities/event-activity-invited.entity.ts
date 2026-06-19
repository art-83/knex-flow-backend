import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { File } from '../../../../files/infra/orm/entities/file.entity';
import { EventActivity } from './event-activity.entity';
import { User } from '../../../../users/infra/orm/entities/user.entity';

@Entity({ name: 'event_activity_invited' })
class EventActivityInvited extends BaseEntitySequentialGeneratedUUID {
  @Column()
  name: string;

  @Column({ nullable: true })
  institution: string;

  @Column({ nullable: true })
  profession: string;

  @ManyToOne(() => EventActivity, eventActivity => eventActivity.event_activity_invited, { nullable: false })
  @JoinColumn({ name: 'event_activity_id' })
  event_activity: EventActivity;

  @ManyToOne(() => User, user => user.event_activity_invited, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'file_id' })
  file: File | null;
}
export { EventActivityInvited };
