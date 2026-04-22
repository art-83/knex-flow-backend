const bullmqConfig = {
  connection: {
    host: String(process.env.BULLMQ_HOST),
    port: Number(process.env.BULLMQ_PORT),
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: { age: 3600, count: 1000 },
    removeOnFail: { age: 604800, count: 5000 },
  },
};

export default bullmqConfig;
