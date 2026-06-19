import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BaseEntitySequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/base-entity-sequential-generated-uuid.entity';
import { Order } from '../../../../events/infra/orm/entities/order.entity';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { CardInformation } from './card-information.entity';

@Entity({ name: 'payments' })
class Payment extends BaseEntitySequentialGeneratedUUID {
  @Column()
  provider: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column({ nullable: true })
  external_id: string;

  @Column({ type: 'timestamptz', nullable: true })
  paid_at: Date;

  @Column({ type: 'timestamptz', nullable: true })
  refunded_at: Date;

  @ManyToOne(() => Order, order => order.payments, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @OneToOne(() => CardInformation, cardInformation => cardInformation.payment)
  card_informations: CardInformation;
}
export { Payment };
