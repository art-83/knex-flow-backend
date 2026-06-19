import { QueueNames } from '../../enums/queues-names.enum';

interface IProducerProvider<TPayload = unknown, TJobOptions = unknown> {
  createJob(queueName: QueueNames, payload: TPayload, jobOptions?: TJobOptions): Promise<void>;
  close(): Promise<void>;
}
export { IProducerProvider };
