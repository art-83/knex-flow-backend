import { inject, injectable } from 'tsyringe';
import { QueueNames } from '../../../../../shared/infra/queue/enums/queues-names.enum';
import { Payment } from '../../orm/entities/payment.entity';
import { IProducerProvider } from '../../../../../shared/infra/queue/infra/providers/producer.provider';
import { BaseJobOptions } from 'bullmq';
import { Request, Response } from 'express';
import bullmqConfig from '../../../../../config/bullmq.config';

@injectable()
export class PaymentController {
  constructor(
    @inject('ProducerProvider') // TODO: Should be a specific DTO for job creation
    private paymentProcessorJobProducer: IProducerProvider<Payment, BaseJobOptions>,
  ) {}

  public async processPayment(request: Request, response: Response) {
    await this.paymentProcessorJobProducer.createJob(
      QueueNames.PAYMENT_PROCESSING,
      request.body,
      bullmqConfig.defaultJobOptions,
    );
    return response.status(200).json({ message: 'Payment created successfully.' });
  }
}
