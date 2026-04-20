import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../../../../events/infra/orm/entities/order.entity';
import { PaymentStatus } from '../../../enums/payment-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { CardInformation } from './card-information.entity';
import { PaymentProvider } from '../enums/payment-provider.enum';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PaymentProvider })
  provider: PaymentProvider;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column({ type: 'timestamp', nullable: true })
  refunded_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => Order, order => order.payments, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @OneToOne(() => CardInformation, card_information => card_information.payment)
  card_information: CardInformation;
}

export default Payment;
