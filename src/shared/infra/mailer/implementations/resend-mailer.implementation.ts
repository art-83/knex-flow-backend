import axios from 'axios';

import { mailerConfig } from '../../../../config/mailer.config';
import { IMailerProvider } from '../providers/mailer.provider';

class ResendMailerImplementation implements IMailerProvider {
  public async sendEmail(to: string[], subject: string, content: string): Promise<void> {
    try {
      await axios.post(
        mailerConfig.apiUrl,
        {
          from: mailerConfig.from,
          to,
          subject,
          html: content,
        },
        {
          headers: {
            Authorization: `Bearer ${mailerConfig.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
}
export { ResendMailerImplementation };
