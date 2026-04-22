import IORedis from 'ioredis';

class RedisConnection {
  private static instance: RedisConnection;
  private connection: IORedis;

  private constructor() {
    this.connection = new IORedis({
      host: String(process.env.REDIS_HOST),
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
    });
  }

  public static getInstance(): RedisConnection {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection();
    }

    return RedisConnection.instance;
  }

  public getConnection(): IORedis {
    return this.connection;
  }

  public async close(): Promise<void> {
    await this.connection.quit();
  }
}

export default RedisConnection;
