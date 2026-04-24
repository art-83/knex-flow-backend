import IORedis from 'ioredis';

import bullmqConfig from '../../../config/bullmq.config';

class RedisConnection {
  private static instance: RedisConnection;
  private connection: IORedis;

  private constructor() {
    this.connection = new IORedis({
      ...bullmqConfig.connection,
      maxRetriesPerRequest: null,
    });
  }

  public static getInstance(): RedisConnection {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection();
    }

    return RedisConnection.instance;
  }

  public static hasInstance(): boolean {
    return Boolean(RedisConnection.instance);
  }

  public getConnection(): IORedis {
    return this.connection;
  }

  public async close(): Promise<void> {
    await this.connection.quit();
  }
}

export default RedisConnection;
