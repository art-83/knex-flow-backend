import 'reflect-metadata';

import '../../containers';
import { container } from 'tsyringe';
import { IWorkerProvider } from './infra/providers/worker.provider';
import { dataSource } from '../orm/database';
import { IRedisConnectionProvider } from './infra/providers/redis-connection.provider';
import { closeWorkers } from './close-workers';
import { initializeWorkers } from './initialize-workers';

async function main() {
  const redisConnection = container.resolve<IRedisConnectionProvider>('RedisConnectionProvider');
  const workers: IWorkerProvider[] = [];

  try {
    await dataSource.initialize();
    await redisConnection.getConnection().ping();
    workers.push(...(await initializeWorkers()));
  } catch (error) {
    await closeWorkers(workers);
    await redisConnection.close();
    if (dataSource.isInitialized) await dataSource.destroy();
    throw error;
  }

  let shutdownPromise: Promise<void> | null = null;

  const shutdown = (): Promise<void> => {
    if (shutdownPromise) return shutdownPromise;

    shutdownPromise = (async () => {
      console.log('[queue-bootstrap] shutting down...');

      await closeWorkers(workers);
      await redisConnection.close();

      if (dataSource.isInitialized) {
        await dataSource.destroy();
      }

      console.log('[queue-bootstrap] shutdown complete');
      process.exit(0);
    })();

    return shutdownPromise;
  };

  process.on(
    'SIGTERM',
    () =>
      void shutdown().catch(error => {
        console.error('[queue-bootstrap] shutdown failed:', error);
        process.exit(1);
      }),
  );

  process.on(
    'SIGINT',
    () =>
      void shutdown().catch(error => {
        console.error('[queue-bootstrap] shutdown failed:', error);
        process.exit(1);
      }),
  );
}

main().catch(error => {
  console.error('[queue-bootstrap] worker startup failed', error);
  process.exit(1);
});
