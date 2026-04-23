import 'reflect-metadata';

import '../../containers';
import { QueueNames } from './enums/queues-names.enum';
import { WorkerFactory } from './factories/worker.factory';
import { IWorkerProvider } from './infra/providers/worker.provider';
import dataSource from '../orm/database';
import RedisConnection from './redis-connection';

async function main() {
  const redisConnection = RedisConnection.getInstance();
  const workers: IWorkerProvider[] = [];

  try {
    await dataSource.initialize();
    await redisConnection.getConnection().ping();

    for (const queueName of Object.values(QueueNames)) {
      const worker = WorkerFactory.createWorker(queueName);
      await worker.initialize();
      workers.push(worker);
      console.log(`[queue-bootstrap] worker ${queueName} started`);
    }
  } catch (error) {
    await Promise.allSettled(workers.map(w => w.close()));
    await redisConnection.close();
    if (dataSource.isInitialized) await dataSource.destroy();
    throw error;
  }

  let shutdownPromise: Promise<void> | null = null;

  const shutdown = (): Promise<void> => {
    if (shutdownPromise) return shutdownPromise;

    shutdownPromise = (async () => {
      console.log('[queue-bootstrap] shutting down...');

      const results = await Promise.allSettled(workers.map(w => w.close()));
      results.forEach((result, i) => {
        if (result.status === 'rejected') {
          console.error(`[queue-bootstrap] failed to close worker ${i}:`, result.reason);
        }
      });

      await redisConnection.close();
      await dataSource.destroy();
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
