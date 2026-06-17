import IORedis from 'ioredis';

import { bullmqConfig } from '../../../config/bullmq.config';
import { IRedisConnectionProvider } from './infra/providers/redis-connection.provider';

class RedisConnection implements IRedisConnectionProvider {
  private connection: IORedis;

  constructor() {
    this.connection = new IORedis({
      ...bullmqConfig.connection,
      maxRetriesPerRequest: null,
    });
  }

  public getConnection(): IORedis {
    return this.connection;
  }

  public async close(): Promise<void> {
    await this.connection.quit();
  }
}
export { RedisConnection };
