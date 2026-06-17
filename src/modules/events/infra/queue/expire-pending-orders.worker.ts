import 'reflect-metadata';

import { Worker } from 'bullmq';
import { container } from 'tsyringe';

import { bullmqConfig } from '../../../../config/bullmq.config';
import { QueueNames } from '../../../../shared/infra/queue/enums/queues-names.enum';
import { IWorkerProvider } from '../../../../shared/infra/queue/infra/providers/worker.provider';
import { IRedisConnectionProvider } from '../../../../shared/infra/queue/infra/providers/redis-connection.provider';
import { ExpirePendingOrdersService } from '../../services/orders/expire-pending-orders.service';

class ExpirePendingOrdersWorker implements IWorkerProvider {
  private worker: Worker<Record<string, never>>;

  public async initialize(): Promise<void> {
    const redisConnection = container.resolve<IRedisConnectionProvider>('RedisConnectionProvider');

    this.worker = new Worker<Record<string, never>>(
      QueueNames.EXPIRE_PENDING_ORDERS,
      async () => {
        const service = container.resolve(ExpirePendingOrdersService);
        return service.execute();
      },
      {
        connection: redisConnection.getConnection(),
        concurrency: bullmqConfig.defaultWorkerOptions.concurrency,
      },
    );

    this.worker.on('completed', (job, result) => {
      console.log(`[worker:expire-pending-orders] completed job ${job.id} (expired=${result?.expired_count ?? 0})`);
    });

    this.worker.on('failed', (job, error) => {
      console.log(`[worker:expire-pending-orders] failed job ${job?.id ?? 'unknown'}: ${error.message}`);
    });

    this.worker.on('error', error => {
      console.error('[worker:expire-pending-orders] error:', error);
    });

    await this.worker.waitUntilReady();
  }

  public async close(): Promise<void> {
    await this.worker.close();
  }
}
export { ExpirePendingOrdersWorker };
