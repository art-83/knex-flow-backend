import { QueueNames } from '../enums/queues-names.enum';
import { PaymentProcessingWorker } from '../../../../modules/payments/infra/queue/payment-processing.worker';
import { IWorkerProvider } from '../infra/providers/worker.provider';

export class WorkerFactory {
  public static createWorker(queueName: QueueNames): IWorkerProvider {
    switch (queueName) {
      case QueueNames.PAYMENT_PROCESSING:
        return new PaymentProcessingWorker();
      default:
        throw new Error(`Worker ${queueName} not found`);
    }
  }
}
