export interface IWorkerProvider {
  initialize(): Promise<void>;
  close(): Promise<void>;
}
