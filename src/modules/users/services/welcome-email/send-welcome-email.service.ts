import { inject, injectable } from 'tsyringe';

import { welcomeEmailBodyContent } from '../../../../shared/infra/mailer/utils/html-welcome-body-content';
import { IMailerProvider } from '../../../../shared/infra/mailer/providers/mailer.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IUserRepositoryProvider } from '../../infra/orm/repositories/providers/user-repository.provider';

@injectable()
class SendWelcomeEmailService {
  constructor(
    @inject('UserRepositoryProvider')
    private userRepository: IUserRepositoryProvider,
    @inject('MailerProvider')
    private mailerProvider: IMailerProvider,
  ) {}

  public async execute(user_id: string): Promise<void> {
    const user = (await this.userRepository.find({ id: user_id })).at(0);

    if (!user) {
      throw new AppError(404, 'User not found.', 'Usuario nao encontrado.');
    }

    const displayName = user.email.split('@').at(0) ?? user.email;

    await this.mailerProvider.sendEmail([user.email], 'Bem-vindo ao Knex Flow', welcomeEmailBodyContent(displayName));
  }
}
export { SendWelcomeEmailService };
