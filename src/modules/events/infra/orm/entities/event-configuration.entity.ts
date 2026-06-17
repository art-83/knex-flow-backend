import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { Event } from './event.entity';

@Entity({ name: 'event_configurations' })
class EventConfiguration extends BaseEntitySequentialGeneratedUUID {
  // TODO: definir tipo do configuration com o time
  @Column({ type: 'jsonb', nullable: true })
  configuration: Record<string, any>;

  @OneToOne(() => Event, event => event.configuration, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
export { EventConfiguration };
