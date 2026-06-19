import { Request, Response } from 'express';
import { container, injectable } from 'tsyringe';

import { CreatePaymentService } from '../../../services/payments/create-payment.service';
import { FindPendingPaymentByOrderService } from '../../../services/payments/find-pending-payment-by-order.service';
import { FindUserPaymentsService } from '../../../services/me/find-user-payments.service';

@injectable()
class PaymentController {
  public async findPendingPaymentByOrder(request: Request, response: Response): Promise<Response> {
    const findPendingPaymentByOrderService = container.resolve(FindPendingPaymentByOrderService);
    const result = await findPendingPaymentByOrderService.execute(request.user_id, String(request.params.order_id));
    return response.json(result);
  }

  public async findUserPaymentById(request: Request, response: Response): Promise<Response> {
    const findUserPaymentsService = container.resolve(FindUserPaymentsService);
    const result = await findUserPaymentsService.execute(request.user_id, request.params);
    return response.json(result);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const createPaymentService = container.resolve(CreatePaymentService);
    const result = await createPaymentService.execute(request.user_id, request.body);

    return response.status(201).json(result);
  }
}
export { PaymentController };
