import { bullmqConfig } from '../../../config/bullmq.config';
import { closeWorkers } from './close-workers';
import { QueueNames } from './enums/queues-names.enum';
import { WorkerFactory } from './factories/worker.factory';
import { IWorkerProvider } from './infra/providers/worker.provider';

async function initializeWorkers(): Promise<IWorkerProvider[]> {
  const workers: IWorkerProvider[] = [];

  try {
    for (const queueName of Object.values(QueueNames)) {
      const worker = WorkerFactory.createWorker(queueName);
      await worker.initialize();
      workers.push(worker);
      console.log(
        `[workers-bootstrap] worker ${queueName} started (concurrency=${bullmqConfig.defaultWorkerOptions.concurrency})`,
      );
    }

    return workers;
  } catch (error) {
    await closeWorkers(workers);
    throw error;
  }
}
export { initializeWorkers };
