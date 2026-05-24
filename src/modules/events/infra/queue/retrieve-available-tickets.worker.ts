import 'reflect-metadata';

import { Worker } from 'bullmq';
import { container } from 'tsyringe';

import { QueueNames } from '../../../../shared/infra/queue/enums/queues-names.enum';
import { IWorkerProvider } from '../../../../shared/infra/queue/infra/providers/worker.provider';
import RedisConnection from '../../../../shared/infra/queue/redis-connection';
import IWebSocketProvider from '../../../../shared/infra/socket/infra/providers/web-socket.provider';
import RetrieveAvailableTicketsJobPayloadDTO from '../../dtos/ticket/retrieve-available-tickets-job-payload.dto';
import GetTicketsAvaliabilityAndMaybeCreateOrderService from '../../services/tickets/find-tickets-avaliability-and-maybe-create-order.service';
import bullmqConfig from '../../../../config/bullmq.config';

export class RetrieveAvailableTicketsWorker implements IWorkerProvider {
  private worker: Worker<RetrieveAvailableTicketsJobPayloadDTO>;

  public async initialize(): Promise<void> {
    this.worker = new Worker<RetrieveAvailableTicketsJobPayloadDTO>(
      QueueNames.RETRIEVE_AVAILABLE_TICKETS,
      async job => {
        const service = container.resolve(GetTicketsAvaliabilityAndMaybeCreateOrderService);
        return service.execute(job.data.body.user_id, job.data.body.event_id);
      },
      {
        connection: RedisConnection.getInstance().getConnection(),
      },
    );

    this.worker.on('completed', async job => {
      console.log(`[worker:retrieve-available-tickets] completed job ${job.id}`);
      const webSocketProvider = container.resolve<IWebSocketProvider>('WebSocketProvider');
      await webSocketProvider.sendMessage({
        channelId: job.data.channel_id,
        payload: {
          type: QueueNames.RETRIEVE_AVAILABLE_TICKETS,
          data: job.returnvalue,
        },
      });
    });

    this.worker.on('failed', async (job, error) => {
      console.log(`[worker:retrieve-available-tickets] failed job ${job?.id ?? 'unknown'}: ${error.message}`);
      if (job && job.attemptsMade === bullmqConfig.defaultJobOptions.attempts) {
        const webSocketProvider = container.resolve<IWebSocketProvider>('WebSocketProvider');
        await webSocketProvider.sendMessage({
          channelId: job.data.channel_id,
          payload: {
            type: QueueNames.RETRIEVE_AVAILABLE_TICKETS,
            data: { error: error.message },
          },
        });
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
