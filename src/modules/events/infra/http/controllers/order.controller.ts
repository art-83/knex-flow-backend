import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindUserOrdersService } from '../../../services/orders/find-user-orders.service';

class OrderController {
  public async findUserOrders(request: Request, response: Response) {
    const findUserOrdersService = container.resolve(FindUserOrdersService);
    const orders = await findUserOrdersService.execute(request.user_id, request.query);
    return response.json(orders);
  }
}

export default OrderController;
