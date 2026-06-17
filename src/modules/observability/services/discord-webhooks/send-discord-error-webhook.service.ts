import axios from 'axios';
import { injectable } from 'tsyringe';

import { discordConfig } from '../../../../config/discord.config';
import { DiscordErrorWebhookJobPayloadDTO } from '../../dtos/discord-error-webhook/discord-error-webhook-job-payload.dto';

@injectable()
class SendDiscordErrorWebhookService {
  public async execute(data: DiscordErrorWebhookJobPayloadDTO): Promise<void> {
    const content = this.formatMessage(data);

    try {
      await axios.post(discordConfig.errorWebhookUrl, { content });
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
