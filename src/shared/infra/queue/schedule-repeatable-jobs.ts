import { Queue } from 'bullmq';
import { container } from 'tsyringe';

import { orderConfig } from '../../../config/order.config';
import { QueueNames } from './enums/queues-names.enum';
import { IRedisConnectionProvider } from './infra/providers/redis-connection.provider';

async function scheduleRepeatableJobs(): Promise<void> {
  const redisConnection = container.resolve<IRedisConnectionProvider>('RedisConnectionProvider');

  const queue = new Queue(QueueNames.EXPIRE_PENDING_ORDERS, {
    connection: redisConnection.getConnection(),
  });

  await queue.add(
    QueueNames.EXPIRE_PENDING_ORDERS,
    {},
    {
      repeat: { every: orderConfig.expirationIntervalMs },
      jobId: 'expire-pending-orders-repeatable',
    },
  );

  await queue.close();

  console.log(`[schedule-repeatable-jobs] expire-pending-orders scheduled every ${orderConfig.expirationIntervalMs}ms`);
}
export { scheduleRepeatableJobs };
