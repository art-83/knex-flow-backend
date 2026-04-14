import { Order } from '../../infra/orm/entities/order.entity';

interface CreateOrUpdateOrderDTO extends Order {
  // TODO: quando User virar @ManyToOne, declarar user_id: string aqui
}

export default CreateOrUpdateOrderDTO;
