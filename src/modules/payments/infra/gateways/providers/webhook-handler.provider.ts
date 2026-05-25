export interface IWebhookHandlerProvider {
  handle(payload: any): Promise<void>;
}

export default IWebhookHandlerProvider;
