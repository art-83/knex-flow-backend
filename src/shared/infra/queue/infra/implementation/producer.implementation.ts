import { BaseJobOptions, ConnectionOptions, Queue } from 'bullmq';
import bullmqConfig from '../../../../../config/bullmq.config';
import { IProducerProvider } from '../providers/producer.provider';

export class BullMQProducer<T> implements IProducerProvider<T, BaseJobOptions> {
  private queues: Map<string, Queue>;

  constructor() {
    this.queues = new Map();
  }

  async createJob(queueName: string, payload: T, jobOptions: BaseJobOptions): Promise<void> {
    let queue = this.queues.get(queueName);
    if (!queue) {
      queue = new Queue(queueName, { connection: bullmqConfig.connection as ConnectionOptions });
      this.queues.set(queueName, queue);
    }
    await queue.add(queueName, payload, jobOptions);
  }
}
