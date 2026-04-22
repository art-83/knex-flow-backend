import 'reflect-metadata';

import '../../containers';
import { QueueNames } from './enums/queues-names.enum';
import { WorkerFactory } from './factories/worker.factory';
import dataSource from '../orm/database';
import RedisConnection from './redis-connection';

async function main() {
  await dataSource.initialize();

  const workers = [];

  for (const queueName of Object.values(QueueNames)) {
    const worker = WorkerFactory.createWorker(queueName);
    await worker.initialize();
    workers.push(worker);
    console.log(`[queue-bootstrap] worker ${queueName} started`);
  }

  const shutdown = async () => {
    console.log('[queue-bootstrap] shutting down...');
    await Promise.all(workers.map(w => w.close()));
    await RedisConnection.getInstance().close();
    await dataSource.destroy();
    console.log('[queue-bootstrap] shutdown complete');
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch(error => {
  console.error('[queue-bootstrap] worker startup failed', error);
  process.exit(1);
});
