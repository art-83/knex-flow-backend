import { Column, Entity, OneToOne } from 'typeorm';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';
import { Event } from './event.entity';

@Entity({ name: 'addresses' })
class Address extends SequentialGeneratedUUID {
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

  @OneToOne(() => Event, event => event.address)
  event: Event;
}
export { Address };
