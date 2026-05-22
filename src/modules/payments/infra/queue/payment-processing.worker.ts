import 'reflect-metadata';

import { Worker } from 'bullmq';

import Payment from '../orm/entities/payment.entity';
import { IWorkerProvider } from '../../../../shared/infra/queue/infra/providers/worker.provider';
import { container } from 'tsyringe';
import CreatePaymentService from '../../services/create-payment.service';
import { QueueNames } from '../../../../shared/infra/queue/enums/queues-names.enum';
import RedisConnection from '../../../../shared/infra/queue/redis-connection';

export class PaymentProcessingWorker implements IWorkerProvider {
  private worker: Worker<Payment>;

  public async initialize(): Promise<void> {
    this.worker = new Worker<Payment>(
      QueueNames.PAYMENT_PROCESSING,
      async job => {
        const createPaymentService = container.resolve(CreatePaymentService);
        await createPaymentService.execute({ order_id: (job.data as Payment).order?.id });
      },
      {
        connection: RedisConnection.getInstance().getConnection(),
      },
    );

    this.worker.on('completed', job => {
      console.log(`[worker:payment-processing] completed job ${job.id}`);
    });

    this.worker.on('failed', (job, error) => {
      console.log(`[worker:payment-processing] failed job ${job?.id ?? 'unknown'}: ${error.message}`);
    });

    this.worker.on('error', error => {
      console.error('[worker:payment-processing] error:', error);
    });

    await this.worker.waitUntilReady();
  }

  public async close(): Promise<void> {
    await this.worker.close();
  }
}
