import { QueueNames } from '../../enums/queues-names.enum';

export interface IProducerProvider<TPayload = unknown, TJobOptions = unknown> {
  createJob(queueName: QueueNames, payload: TPayload, jobOptions: TJobOptions): Promise<void>;
}
