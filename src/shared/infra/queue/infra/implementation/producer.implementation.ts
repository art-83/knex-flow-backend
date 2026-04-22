import { BaseJobOptions, Queue } from 'bullmq';
import { IProducerProvider } from '../providers/producer.provider';
import RedisConnection from '../../redis-connection';

export class BullMQProducer<T> implements IProducerProvider<T, BaseJobOptions> {
  private queues: Map<string, Queue>;

  constructor() {
    this.queues = new Map();
  }

  async createJob(queueName: string, payload: T, jobOptions: BaseJobOptions): Promise<void> {
    let queue = this.queues.get(queueName);
    if (!queue) {
      queue = new Queue(queueName, { connection: RedisConnection.getInstance().getConnection() });
      this.queues.set(queueName, queue);
    }
    await queue.add(queueName, payload, jobOptions);
  }
}
