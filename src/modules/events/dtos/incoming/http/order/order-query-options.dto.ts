import { DefaultQueryOptionsDTO } from '../../../../../../shared/dtos/incoming/http/query/default-query-options.dto';
import { Order } from '../../../../infra/orm/entities/order.entity';

interface OrderQueryOptionsDTO extends Order, DefaultQueryOptionsDTO {
  user_id: string;
  event_id: string;
}
export { OrderQueryOptionsDTO };
