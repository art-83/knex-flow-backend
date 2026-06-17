import { DefaultQueryOptionsDTO } from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { Order } from '../../infra/orm/entities/order.entity';

interface OrderQueryOptions extends Order, DefaultQueryOptionsDTO {
  user_id: string;
  event_id: string;
}
export { OrderQueryOptions };
