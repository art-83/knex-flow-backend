import { IWebhookClientProvider } from '../../src/modules/observability/infra/webhook/providers/webhook-client.provider';

class FakeWebhookClient implements IWebhookClientProvider {
  public posts: Array<{ url: string; body: Record<string, unknown> }> = [];

  public async post(url: string, body: Record<string, unknown>): Promise<void> {
    this.posts.push({ url, body });
  }
}

export { FakeWebhookClient };
