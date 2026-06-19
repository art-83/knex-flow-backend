import axios from 'axios';
import { IWebhookClientProvider } from '../providers/webhook-client.provider';

class AxiosWebhookClientImplementation implements IWebhookClientProvider {
  public async post(url: string, body: Record<string, unknown>): Promise<void> {
    await axios.post(url, body);
  }
}
export { AxiosWebhookClientImplementation };
