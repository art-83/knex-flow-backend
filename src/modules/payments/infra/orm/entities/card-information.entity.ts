import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { Payment } from './payment.entity';

@Entity({ name: 'card_informations' })
class CardInformation extends BaseEntitySequentialGeneratedUUID {
  @Column({ type: 'char', length: 4 })
  last4: string;

  @Column({ nullable: true })
  brand: string;

  @Column()
  exp_month: number;

  @Column()
  exp_year: number;

  @Column({ nullable: true })
  holder_name: string;

  @OneToOne(() => Payment, payment => payment.card_informations)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;
}
export { CardInformation };
