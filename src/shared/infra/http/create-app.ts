import express, { Express } from 'express';
import { errors } from 'celebrate';
import { container } from 'tsyringe';
import cors from 'cors';
import { Server } from 'node:http';

import { dataSource } from '../orm/database';
import { IProducerProvider } from '../queue/infra/providers/producer.provider';
import { IRedisConnectionProvider } from '../queue/infra/providers/redis-connection.provider';
import { closeWorkers } from '../queue/close-workers';
import { initializeWorkers } from '../queue/initialize-workers';
import { scheduleRepeatableJobs } from '../queue/schedule-repeatable-jobs';
import { routes } from './routes';
import { SyncPermissionsService } from '../../../modules/users/services/permissions/sync-permissions.service';
import { IWebSocketProvider } from '../socket/infra/providers/web-socket.provider';
import { IWorkerProvider } from '../queue/infra/providers/worker.provider';

interface CreateAppOptions {
  port?: number;
  enableWorkers?: boolean;
  enableWebSocket?: boolean;
}

interface CreateAppResult {
  app: Express;
  httpServer: Server | null;
  shutdown: () => Promise<void>;
}

async function createApp(options: CreateAppOptions = {}): Promise<CreateAppResult> {
  const { port, enableWorkers = false, enableWebSocket = false } = options;

  const producerProvider = container.resolve<IProducerProvider>('ProducerProvider');
  const redisConnection = container.resolve<IRedisConnectionProvider>('RedisConnectionProvider');
  const syncPermissionsService = container.resolve(SyncPermissionsService);

  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(routes);
  app.use(errors());

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  await syncPermissionsService.execute();

  let httpServer: Server | null = null;
  let workers: IWorkerProvider[] = [];

  if (port !== undefined) {
    httpServer = await new Promise<Server>((resolve, reject) => {
      const server = app.listen(port, () => resolve(server));
      server.on('error', reject);
    });
  }

  if (enableWebSocket) {
    if (!httpServer) {
      throw new Error('WebSocket requires an HTTP server with a bound port.');
    }

    const webSocketProvider = container.resolve<IWebSocketProvider>('WebSocketProvider');
    await webSocketProvider.initialize(httpServer);
  }

  if (enableWorkers) {
    workers = await initializeWorkers();
    await scheduleRepeatableJobs();
  }

  const shutdown = async (): Promise<void> => {
    if (workers.length > 0) {
      await closeWorkers(workers);
      workers = [];
    }

    await producerProvider.close();
    await redisConnection.close();

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

    if (httpServer) {
      await new Promise<void>((resolve, reject) => {
        httpServer!.close(error => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
      httpServer = null;
    }
  };

  return { app, httpServer, shutdown };
}
export { CreateAppOptions, CreateAppResult, createApp };
