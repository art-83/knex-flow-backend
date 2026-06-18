import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { Event } from './event.entity';

@Entity({ name: 'addresses' })
class Address extends BaseEntitySequentialGeneratedUUID {
  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  zip_code: string;

  @OneToOne(() => Event, event => event.address, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event: Event;
}
export { Address };
