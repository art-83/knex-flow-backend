import IORedis from 'ioredis';

export interface IRedisConnectionProvider {
  getConnection(): IORedis;
  close(): Promise<void>;
}
