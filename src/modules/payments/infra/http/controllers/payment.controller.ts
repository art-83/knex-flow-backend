import { inject, injectable, container } from 'tsyringe';
import { Request, Response } from 'express';
import { BaseJobOptions } from 'bullmq';

import { QueueNames } from '../../../../../shared/infra/queue/enums/queues-names.enum';
import { IProducerProvider } from '../../../../../shared/infra/queue/infra/providers/producer.provider';
import bullmqConfig from '../../../../../config/bullmq.config';
import { Payment } from '../../orm/entities/payment.entity';
import { AbacatepayCreatePixPaymentDTO } from '../../../dtos/gateways/abacatepay-create-pix-payment.dto';
import CreatePixPaymentService from '../../../services/create-pix-payment.service';

@injectable()
export class PaymentController {
  constructor(
    @inject('ProducerProvider')
    private paymentProcessorJobProducer: IProducerProvider<Payment, BaseJobOptions>,
  ) {}

  public async createPix(request: Request, response: Response): Promise<Response> {
    const createPixPaymentService = container.resolve(CreatePixPaymentService);
    const payment = await createPixPaymentService.execute(request.body as AbacatepayCreatePixPaymentDTO);
    return response.status(201).json(payment);
  }

  public async processPayment(request: Request, response: Response): Promise<Response> {
    await this.paymentProcessorJobProducer.createJob(
      QueueNames.PAYMENT_PROCESSING,
      request.body,
      bullmqConfig.defaultJobOptions,
    );
    return response.status(200).json({ message: 'Payment created successfully.' });
  }
}
