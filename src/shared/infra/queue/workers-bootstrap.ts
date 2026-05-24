import { QueueNames } from './enums/queues-names.enum';
import { WorkerFactory } from './factories/worker.factory';
import { IWorkerProvider } from './infra/providers/worker.provider';

export async function initializeWorkers(): Promise<IWorkerProvider[]> {
  const workers: IWorkerProvider[] = [];

  try {
    for (const queueName of Object.values(QueueNames)) {
      const worker = WorkerFactory.createWorker(queueName);
      await worker.initialize();
      workers.push(worker);
      console.log(`[workers-bootstrap] worker ${queueName} started`);
    }

    return workers;
  } catch (error) {
    await closeWorkers(workers);
    throw error;
  }
}

export async function closeWorkers(workers: IWorkerProvider[]): Promise<void> {
  const results = await Promise.allSettled(workers.map(worker => worker.close()));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`[workers-bootstrap] failed to close worker ${index}:`, result.reason);
    }
  });
}
