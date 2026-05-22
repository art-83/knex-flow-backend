import { Request, Response } from 'express';
import { container, injectable } from 'tsyringe';

import { CreatePaymentDTO } from '../../../dtos/payments/create-payment.dto';
import CreatePaymentService from '../../../services/create-payment.service';

@injectable()
export class PaymentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createPaymentService = container.resolve(CreatePaymentService);

    const result = await createPaymentService.execute(request.body);

    return response.status(201).json(result);
  }
}
