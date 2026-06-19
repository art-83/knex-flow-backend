import { IWorkerProvider } from './infra/providers/worker.provider';

async function closeWorkers(workers: IWorkerProvider[]): Promise<void> {
  const results = await Promise.allSettled(workers.map(worker => worker.close()));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`[workers-bootstrap] failed to close worker ${index}:`, result.reason);
    }
  });
}
export { closeWorkers };
