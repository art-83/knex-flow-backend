import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from 'typeorm';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';
import { Event } from './event.entity';

@Entity({ name: 'event_configurations' })
class EventConfiguration extends SequentialGeneratedUUID {
  // TODO: definir tipo do configuration com o time
  @Column({ type: 'jsonb', nullable: true })
  configuration: Record<string, any>;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @OneToOne(() => Event, event => event.configuration, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
export { EventConfiguration };
