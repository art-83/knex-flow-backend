import 'reflect-metadata';

import { Worker } from 'bullmq';
import { container } from 'tsyringe';

import { bullmqConfig } from '../../../../config/bullmq.config';
import { QueueNames } from '../../../../shared/infra/queue/enums/queues-names.enum';
import { IWorkerProvider } from '../../../../shared/infra/queue/infra/providers/worker.provider';
import { IRedisConnectionProvider } from '../../../../shared/infra/queue/infra/providers/redis-connection.provider';
import { WelcomeEmailJobPayloadDTO } from '../../dtos/internal/queue/welcome-email-job-payload.dto';
import { SendWelcomeEmailService } from '../../services/welcome-email/send-welcome-email.service';

class WelcomeWorker implements IWorkerProvider {
  private worker: Worker<WelcomeEmailJobPayloadDTO>;

  public async initialize(): Promise<void> {
    const redisConnection = container.resolve<IRedisConnectionProvider>('RedisConnectionProvider');

    this.worker = new Worker<WelcomeEmailJobPayloadDTO>(
      QueueNames.SEND_WELCOME_EMAIL,
      async job => {
        const service = container.resolve(SendWelcomeEmailService);
        return service.execute(job.data.user_id);
      },
      {
        connection: redisConnection.getConnection(),
        concurrency: bullmqConfig.defaultWorkerOptions.concurrency,
      },
    );

    this.worker.on('completed', job => {
      console.log(`[worker:send-welcome-email] completed job ${job.id}`);
    });

    this.worker.on('failed', (job, error) => {
      console.log(`[worker:send-welcome-email] failed job ${job?.id ?? 'unknown'}: ${error.message}`);
    });

    this.worker.on('error', error => {
      console.error('[worker:send-welcome-email] error:', error);
    });

    await this.worker.waitUntilReady();
  }

  public async close(): Promise<void> {
    await this.worker.close();
  }
}
export { WelcomeWorker };
