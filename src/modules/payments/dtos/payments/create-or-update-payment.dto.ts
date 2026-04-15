import Payment from '../../infra/orm/entities/payment.entity';

export interface CreateOrUpdatePaymentsDTO extends Payment {
  order_id: string;
}
