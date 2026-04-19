import 'reflect-metadata';

import '../../containers';
import { QueueNames } from './enums/queues-names.enum';
import { WorkerFactory } from './factories/worker.factory';
import dataSource from '../orm/database';

async function main() {
  await dataSource.initialize();

  for (const queueName of Object.values(QueueNames)) {
    const worker = WorkerFactory.createWorker(queueName);
    await worker.initialize();
    console.log(`[queue-bootstrap] worker ${queueName} started`);
  }
}

main().catch(error => {
  console.error('[queue-bootstrap] worker startup failed', error);
  process.exit(1);
});
