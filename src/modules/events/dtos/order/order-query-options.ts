import DefaultQueryOptionsDTO from '../../../../shared/infra/orm/dtos/default-query-options.dto';
import { Order } from '../../infra/orm/entities/order.entity';

interface OrderQueryOptions extends Order, DefaultQueryOptionsDTO {
  // TODO: quando User virar @ManyToOne, declarar user_id: string aqui
}

export default OrderQueryOptions;
