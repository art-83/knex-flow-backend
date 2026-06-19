const bullmqConfig = {
  connection: {
    host: String(process.env.BULLMQ_HOST),
    port: Number(process.env.BULLMQ_PORT),
  },
  defaultWorkerOptions: {
    concurrency: Number(process.env.BULLMQ_WORKER_CONCURRENCY),
  },
  defaultJobOptions: {
    attempts: Number(process.env.BULLMQ_JOB_ATTEMPTS),
    backoff: {
      type: 'exponential',
      delay: Number(process.env.BULLMQ_JOB_BACKOFF_DELAY_MS),
    },
    removeOnComplete: {
      age: Number(process.env.BULLMQ_REMOVE_ON_COMPLETE_AGE),
      count: Number(process.env.BULLMQ_REMOVE_ON_COMPLETE_COUNT),
    },
    removeOnFail: {
      age: Number(process.env.BULLMQ_REMOVE_ON_FAIL_AGE),
      count: Number(process.env.BULLMQ_REMOVE_ON_FAIL_COUNT),
    },
  },
};
export { bullmqConfig };
