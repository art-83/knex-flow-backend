interface IWebhookClientProvider {
  post(url: string, body: Record<string, unknown>): Promise<void>;
}
export { IWebhookClientProvider };
