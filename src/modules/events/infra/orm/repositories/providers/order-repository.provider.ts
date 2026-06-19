import { IRepositoryProvider } from '../../../../../../shared/infra/orm/providers/repository.provider';
import { CreatePendingOrderAttemptDTO } from '../../../../dtos/internal/repositories/create-pending-order-attempt.dto';
import { CreatePendingOrderAttemptOutcomeDTO } from '../../../../dtos/internal/repositories/create-pending-order-attempt-outcome.dto';
import { ConfirmPaidOrderDTO } from '../../../../dtos/internal/repositories/confirm-paid-order.dto';
import { ConfirmPaidOrderResultDTO } from '../../../../dtos/internal/repositories/confirm-paid-order-result.dto';
import { Order } from '../../entities/order.entity';

interface IOrderRepositoryProvider extends IRepositoryProvider<Order> {
  createPendingOrderAttempt(data: CreatePendingOrderAttemptDTO): Promise<CreatePendingOrderAttemptOutcomeDTO>;
  confirmPaidOrder(data: ConfirmPaidOrderDTO): Promise<ConfirmPaidOrderResultDTO>;
  expirePendingOrder(orderId: string): Promise<void>;
  refundPaidOrder(orderId: string, paymentId: string): Promise<void>;
  disputeOrder(orderId: string, paymentId: string): Promise<void>;
  loseDisputedOrder(orderId: string, paymentId: string): Promise<void>;
}
export { IOrderRepositoryProvider };
