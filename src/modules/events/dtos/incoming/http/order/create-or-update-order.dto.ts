import { Order } from '../../../../infra/orm/entities/order.entity';

interface CreateOrUpdateOrderDTO extends Order {
  user_id: string;
}
export { CreateOrUpdateOrderDTO };
