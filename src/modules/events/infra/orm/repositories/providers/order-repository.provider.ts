import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import {
  CreatePendingOrderAttemptDTO,
  CreatePendingOrderAttemptResult,
} from '../../../../dtos/order/create-pending-order-attempt.dto';
import { Order } from '../../entities/order.entity';

interface IOrderRepositoryProvider extends IRepositoryProvider<Order> {
  createPendingOrderAttempt(data: CreatePendingOrderAttemptDTO): Promise<CreatePendingOrderAttemptResult | null>;
  expirePendingOrder(orderId: string): Promise<void>;
}
export { IOrderRepositoryProvider };
