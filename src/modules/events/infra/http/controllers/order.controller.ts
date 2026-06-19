import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindUserOrdersService } from '../../../services/orders/find-user-orders.service';
import { RequestOrderRefundService } from '../../../services/orders/request-order-refund.service';

class OrderController {
  public async findUserOrders(request: Request, response: Response) {
    const findUserOrdersService = container.resolve(FindUserOrdersService);
    const orders = await findUserOrdersService.execute(request.user_id, request.query);
    return response.json(orders);
  }

  public async requestRefund(request: Request, response: Response) {
    const requestOrderRefundService = container.resolve(RequestOrderRefundService);
    const result = await requestOrderRefundService.execute(request.user_id, String(request.params.id), request.body);
    return response.status(202).json(result);
  }
}
export { OrderController };
