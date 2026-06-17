interface IWebhookHandlerProvider<T> {
  handle(payload: T): Promise<void>;
}
export { IWebhookHandlerProvider };
