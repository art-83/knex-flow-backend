import { inject, injectable } from 'tsyringe';

import { discordConfig } from '../../../../config/discord.config';
import { DiscordErrorWebhookJobPayloadDTO } from '../../dtos/internal/queue/discord-error-webhook-job-payload.dto';
import { IWebhookClientProvider } from '../../infra/webhook/providers/webhook-client.provider';

@injectable()
class SendDiscordErrorWebhookService {
  constructor(
    @inject('WebhookClientProvider')
    private webhookClient: IWebhookClientProvider,
  ) {}

  public async execute(data: DiscordErrorWebhookJobPayloadDTO): Promise<void> {
    const content = this.formatMessage(data);

    try {
      await this.webhookClient.post(discordConfig.errorWebhookUrl, { content });
    } catch (error) {
      console.log(error);
    }
  }

  private formatMessage(data: DiscordErrorWebhookJobPayloadDTO): string {
    const stack = data.stack ? `\n\`\`\`\n${data.stack.slice(0, 1500)}\n\`\`\`` : '';

    return `**[Knex Flow] Error**\n${data.message}${stack}`;
  }
}
export { SendDiscordErrorWebhookService };
