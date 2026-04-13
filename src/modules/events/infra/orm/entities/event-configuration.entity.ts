import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from './event.entity';

@Entity({ name: 'event_configurations' })
export class EventConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: definir tipo do configuration com o time
  @Column({ type: 'jsonb' })
  configuration: Record<string, unknown>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToOne(() => Event, event => event.configuration, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}

export default EventConfiguration;
