export interface IWorkerProvider {
  initialize(): Promise<void>;
}
