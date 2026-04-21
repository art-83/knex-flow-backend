import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { AbacatepayCreatePixPaymentDTO } from '../../../dtos/gateways/abacatepay-create-pix-payment.dto';
import CreatePixPaymentService from '../../../services/create-pix-payment.service';

class PaymentController {
  public async createPix(request: Request, response: Response): Promise<Response> {
    const createPixPaymentService = container.resolve(CreatePixPaymentService);
    const payment = await createPixPaymentService.execute(request.body);
    return response.status(201).json(payment);
  }
}

export default PaymentController;
