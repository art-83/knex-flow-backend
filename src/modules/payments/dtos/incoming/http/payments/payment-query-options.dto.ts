import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { Payment } from '../../../../infra/orm/entities/payment.entity';

interface PaymentQueryOptionsDTO extends Payment, DefaultQueryOptionsDTO {
  order_id: string;
  user_id: string;
}
export { PaymentQueryOptionsDTO };
