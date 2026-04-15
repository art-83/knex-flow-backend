import DefaultQueryOptionsDTO from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import Payment from '../../infra/orm/entities/payment.entity';

export interface PaymentQueryOptions extends Payment, DefaultQueryOptionsDTO {
  order_id: string;
}
