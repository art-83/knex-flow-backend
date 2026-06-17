import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { Payment } from '../../infra/orm/entities/payment.entity';

interface PaymentQueryOptions extends Payment, DefaultQueryOptionsDTO {
  order_id: string;
  user_id: string;
}
export { PaymentQueryOptions };
