import 'reflect-metadata';

import { ConnectionOptions, Worker } from 'bullmq';

import bullmqConfig from '../../../../config/bullmq.config';
import Payment from '../orm/entities/payment.entity';
import { IWorkerProvider } from '../../../../shared/infra/queue/infra/providers/worker.provider';
import { PaymentProcessorService } from '../../services/payment-processor.service';
import { container } from 'tsyringe';
import { QueueNames } from '../../../../shared/infra/queue/enums/queues-names.enum';

export class PaymentProcessingWorker implements IWorkerProvider {
  private worker: Worker<Payment>;

  public async initialize(): Promise<void> {
    this.worker = new Worker<Payment>(
      QueueNames.PAYMENT_PROCESSING,
      async job => {
        const paymentProcessorService = container.resolve(PaymentProcessorService);
        await paymentProcessorService.execute(job.data);
      },
      {
        connection: bullmqConfig.connection as ConnectionOptions,
      },
    );

    this.worker.on('completed', job => {
      console.log(`[worker:payment-processing] completed job ${job.id}`);
    });

    this.worker.on('failed', (job, error) => {
      console.log(`[worker:payment-processing] failed job ${job?.id ?? 'unknown'}: ${error.message}`);
    });
  }
}
