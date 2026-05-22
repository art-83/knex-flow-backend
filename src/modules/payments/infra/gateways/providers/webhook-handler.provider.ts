export interface IWebhookHandlerProvider {
  handle(payload: Record<string, unknown>): Promise<void>;
}

export default IWebhookHandlerProvider;
