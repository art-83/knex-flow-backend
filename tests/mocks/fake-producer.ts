import { QueueNames } from '../../src/shared/infra/queue/enums/queues-names.enum';
import { IProducerProvider } from '../../src/shared/infra/queue/infra/providers/producer.provider';

interface QueuedJob {
  queueName: QueueNames;
  payload: unknown;
  jobOptions?: unknown;
}

class FakeProducer implements IProducerProvider {
  public jobs: QueuedJob[] = [];

  public async createJob(queueName: QueueNames, payload: unknown, jobOptions?: unknown): Promise<void> {
    this.jobs.push({ queueName, payload, jobOptions });
  }

  public async close(): Promise<void> {}
}

export { FakeProducer, QueuedJob };
