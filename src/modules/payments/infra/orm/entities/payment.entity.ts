import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { SequentialGeneratedUUID } from '../../../../../shared/infra/orm/entities/sequential-generated-uuid.entity';
import { Order } from '../../../../events/infra/orm/entities/order.entity';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { CardInformation } from './card-information.entity';

@Entity({ name: 'payments' })
export class Payment extends SequentialGeneratedUUID {
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
  refunded_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @ManyToOne(() => Order, order => order.payments, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @OneToOne(() => CardInformation, card_information => card_information.payment)
  card_information: CardInformation;
}

export default Payment;
