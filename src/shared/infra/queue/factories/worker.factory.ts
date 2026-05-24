import { QueueNames } from '../enums/queues-names.enum';
import { RetrieveAvailableTicketsWorker } from '../../../../modules/events/infra/queue/retrieve-available-tickets.worker';
import { IWorkerProvider } from '../infra/providers/worker.provider';

export class WorkerFactory {
  public static createWorker(queueName: QueueNames): IWorkerProvider {
    switch (queueName) {
      case QueueNames.RETRIEVE_AVAILABLE_TICKETS:
        return new RetrieveAvailableTicketsWorker();
      default:
        throw new Error(`Worker ${queueName} not found`);
    }
  }
}
