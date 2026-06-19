import 'reflect-metadata';

import { Worker } from 'bullmq';
import { container } from 'tsyringe';

import { QueueNames } from '../../../../shared/infra/queue/enums/queues-names.enum';
import { IWorkerProvider } from '../../../../shared/infra/queue/infra/providers/worker.provider';
import { IRedisConnectionProvider } from '../../../../shared/infra/queue/infra/providers/redis-connection.provider';
import { IWebSocketProvider } from '../../../../shared/infra/socket/infra/providers/web-socket.provider';
import { RetrieveAvailableTicketsJobPayloadDTO } from '../../dtos/internal/queue/retrieve-available-tickets-job-payload.dto';
import { GetTicketsAvaliabilityAndMaybeCreateOrderService } from '../../services/tickets/find-tickets-avaliability-and-maybe-create-order.service';
import { bullmqConfig } from '../../../../config/bullmq.config';
import { WebSocketType } from '../../../../shared/infra/socket/enums/web-socket-type';

class RetrieveAvailableTicketsWorker implements IWorkerProvider {
  private worker: Worker<RetrieveAvailableTicketsJobPayloadDTO>;

  public async initialize(): Promise<void> {
    const redisConnection = container.resolve<IRedisConnectionProvider>('RedisConnectionProvider');

    this.worker = new Worker<RetrieveAvailableTicketsJobPayloadDTO>(
      QueueNames.RETRIEVE_AVAILABLE_TICKETS,
      async job => {
        const service = container.resolve(GetTicketsAvaliabilityAndMaybeCreateOrderService);
        return service.execute(job.data.body.user_id, job.data.body.event_id, job.data.body.event_activity_ids ?? []);
      },
      {
        connection: redisConnection.getConnection(),
        concurrency: bullmqConfig.defaultWorkerOptions.concurrency,
      },
    );

    this.worker.on('completed', async job => {
      console.log(`[worker:retrieve-available-tickets] completed job ${job.id}`);
      const webSocketProvider = container.resolve<IWebSocketProvider>('WebSocketProvider');
      await webSocketProvider.sendMessage({
        channel_id: job.data.channel_id,
        type: WebSocketType.RETRIEVE_AVAILABLE_TICKETS,
        payload: {
          data: job.returnvalue,
        },
      });
      await webSocketProvider.closeConnection(job.data.channel_id);
    });

    this.worker.on('failed', async (job, error) => {
      console.log(`[worker:retrieve-available-tickets] failed job ${job?.id ?? 'unknown'}: ${error.message}`);
      if (job && job.attemptsMade === bullmqConfig.defaultJobOptions.attempts) {
        const webSocketProvider = container.resolve<IWebSocketProvider>('WebSocketProvider');
        await webSocketProvider.sendMessage({
          channel_id: job.data.channel_id,
          type: WebSocketType.RETRIEVE_AVAILABLE_TICKETS,
          payload: {
            data: { error: error.message },
          },
        });
        await webSocketProvider.closeConnection(job.data.channel_id);
      }
    });

    this.worker.on('error', error => {
      console.error('[worker:retrieve-available-tickets] error:', error);
    });

    await this.worker.waitUntilReady();
  }

  public async close(): Promise<void> {
    await this.worker.close();
  }
}
export { RetrieveAvailableTicketsWorker };
