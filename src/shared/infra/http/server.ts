import '../../containers';
import express from 'express';
import { errors } from 'celebrate';
import { container } from 'tsyringe';
import { dataSource } from '../orm/database';
import { IProducerProvider } from '../queue/infra/providers/producer.provider';
import { IRedisConnectionProvider } from '../queue/infra/providers/redis-connection.provider';
import { closeWorkers, initializeWorkers } from '../queue/workers-bootstrap';
import { scheduleRepeatableJobs } from '../queue/schedule-repeatable-jobs';
import { routes } from './routes';
import { SyncPermissionsService } from '../../../modules/users/services/permissions/sync-permissions.service';
import cors from 'cors';
import { IWebSocketProvider } from '../socket/infra/providers/web-socket.provider';
import { webConnectionConfig } from '../../../config/web-connection.config';

async function main() {
  const port = webConnectionConfig.http.port;
  const producerProvider = container.resolve<IProducerProvider>('ProducerProvider');
  const redisConnection = container.resolve<IRedisConnectionProvider>('RedisConnectionProvider');
  const syncPermissionsService = new SyncPermissionsService();

  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(routes);
  app.use(errors());

  await dataSource.initialize();
  await syncPermissionsService.execute();

  const server = app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });

  const webSocketProvider = container.resolve<IWebSocketProvider>('WebSocketProvider');
  await webSocketProvider.initialize(server);
  const workers = await initializeWorkers();
  await scheduleRepeatableJobs();

  const shutdownResources = async (): Promise<void> => {
    await closeWorkers(workers);
    await producerProvider.close();
    await redisConnection.close();

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  };

  process.on('SIGINT', async () => {
    console.log('SIGINT received');
    console.log('Shutting down resources...');
    await shutdownResources();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM received');
    console.log('Shutting down resources...');
    await shutdownResources();
    process.exit(0);
  });
}
main();
