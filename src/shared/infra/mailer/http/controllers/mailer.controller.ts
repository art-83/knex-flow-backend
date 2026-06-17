import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IMailerProvider } from '../../providers/mailer.provider';

class MailerController {
  public async sendTestEmail(request: Request, response: Response): Promise<Response> {
    const mailerProvider = container.resolve<IMailerProvider>('MailerProvider');

    const { to, subject, content } = request.body;

    await mailerProvider.sendEmail(to, subject, content);

    return response.status(200).json({
      message: 'Test email dispatch completed.',
    });
  }
}
export { MailerController };
