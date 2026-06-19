import { IMailerProvider } from '../../src/shared/infra/mailer/providers/mailer.provider';

interface SentEmail {
  to: string[];
  subject: string;
  content: string;
}

class FakeMailer implements IMailerProvider {
  public sentEmails: SentEmail[] = [];

  public async sendEmail(to: string[], subject: string, content: string): Promise<void> {
    this.sentEmails.push({ to, subject, content });
  }
}

export { FakeMailer, SentEmail };
