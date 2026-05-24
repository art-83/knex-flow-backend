import { BaseJobOptions, Queue } from 'bullmq';
import { inject, injectable } from 'tsyringe';
import { IProducerProvider } from '../providers/producer.provider';
import { IRedisConnectionProvider } from '../providers/redis-connection.provider';

@injectable()
export class BullMQProducer<T> implements IProducerProvider<T, BaseJobOptions> {
  private queues: Map<string, Queue>;

  constructor(
    @inject('RedisConnectionProvider')
    private redisConnection: IRedisConnectionProvider,
  ) {
    this.queues = new Map();
  }

  async createJob(queueName: string, payload: T, jobOptions: BaseJobOptions): Promise<void> {
    let queue = this.queues.get(queueName);
    if (!queue) {
      queue = new Queue(queueName, { connection: this.redisConnection.getConnection() });
      this.queues.set(queueName, queue);
    }
    await queue.add(queueName, payload, jobOptions);
  }

  async close(): Promise<void> {
    const closeResults = await Promise.allSettled(
      Array.from(this.queues.entries()).map(async ([queueName, queue]) => {
        await queue.close();
        return queueName;
      }),
    );

    closeResults.forEach(result => {
      if (result.status === 'rejected') {
        console.error('[bullmq-producer] failed to close queue:', result.reason);
      }
    });

    this.queues.clear();
  }
}
