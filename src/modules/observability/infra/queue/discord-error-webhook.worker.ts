import 'reflect-metadata';

import { Worker } from 'bullmq';
import { container } from 'tsyringe';

import { bullmqConfig } from '../../../../config/bullmq.config';
import { QueueNames } from '../../../../shared/infra/queue/enums/queues-names.enum';
import { IWorkerProvider } from '../../../../shared/infra/queue/infra/providers/worker.provider';
import { IRedisConnectionProvider } from '../../../../shared/infra/queue/infra/providers/redis-connection.provider';
import { DiscordErrorWebhookJobPayloadDTO } from '../../dtos/discord-error-webhook/discord-error-webhook-job-payload.dto';
import { SendDiscordErrorWebhookService } from '../../services/send-discord-error-webhook.service';

class DiscordErrorWebhookWorker implements IWorkerProvider {
  private worker: Worker<DiscordErrorWebhookJobPayloadDTO>;

  public async initialize(): Promise<void> {
    const redisConnection = container.resolve<IRedisConnectionProvider>('RedisConnectionProvider');

    this.worker = new Worker<DiscordErrorWebhookJobPayloadDTO>(
      QueueNames.DISCORD_ERROR_WEBHOOK,
      async job => {
        const service = container.resolve(SendDiscordErrorWebhookService);
        return service.execute(job.data);
      },
      {
        connection: redisConnection.getConnection(),
        concurrency: bullmqConfig.defaultWorkerOptions.concurrency,
      },
    );

    this.worker.on('completed', job => {
      console.log(`[worker:discord-error-webhook] completed job ${job.id}`);
    });

    this.worker.on('failed', (job, error) => {
      console.log(`[worker:discord-error-webhook] failed job ${job?.id ?? 'unknown'}: ${error.message}`);
    });

    this.worker.on('error', error => {
      console.error('[worker:discord-error-webhook] error:', error);
    });

    await this.worker.waitUntilReady();
  }

  public async close(): Promise<void> {
    await this.worker.close();
  }
}
export { DiscordErrorWebhookWorker };
