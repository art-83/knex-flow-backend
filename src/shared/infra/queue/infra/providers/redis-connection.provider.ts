import IORedis from 'ioredis';

interface IRedisConnectionProvider {
  getConnection(): IORedis;
  close(): Promise<void>;
}
export { IRedisConnectionProvider };
