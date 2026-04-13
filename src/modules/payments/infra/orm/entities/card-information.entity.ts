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
import Payment from './payment.entity';

@Entity({ name: 'card_informations' })
export class CardInformation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToOne(() => Payment, payment => payment.card_information)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;
}

export default CardInformation;
