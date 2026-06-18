import { inject, injectable } from 'tsyringe';
import { IHashProvider } from '../../infra/hash/providers/hash.provider';
import { IJwtProvider } from '../../infra/jwt/providers/jwt.provider';
import { IUserRepositoryProvider } from '../../infra/orm/repositories/providers/user-repository.provider';
import { RegisterDTO } from '../../dtos/auth/register.dto';
import { LoginResponseDTO } from '../../dtos/auth/login-response.dto';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { validatePasswordStrength } from '../../utils/validate-password-strength';
import { IProducerProvider } from '../../../../shared/infra/queue/infra/providers/producer.provider';
import { QueueNames } from '../../../../shared/infra/queue/enums/queues-names.enum';
import { bullmqConfig } from '../../../../config/bullmq.config';
import { WelcomeEmailJobPayloadDTO } from '../../dtos/welcome-email/welcome-email-job-payload.dto';

@injectable()
class RegisterService {
  constructor(
    @inject('UserRepositoryProvider')
    private userRepository: IUserRepositoryProvider,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('JwtProvider')
    private jwtProvider: IJwtProvider,
    @inject('ProducerProvider')
    private producerProvider: IProducerProvider,
  ) {}

  public async execute(data: RegisterDTO): Promise<LoginResponseDTO> {
    const passwordValidation = validatePasswordStrength(data.password);
    if (!passwordValidation.isValid) {
      throw new AppError(
        400,
        'Failed to register. Invalid credentials or email already in use.',
        'Falha no cadastro. Credenciais invalidas ou email ja esta em uso.',
      );
    }

    const existingUsers = await this.userRepository.find({ email: data.email });
    if (existingUsers.length > 0) {
      throw new AppError(
        400,
        'Failed to register. Invalid credentials or email already in use.',
        'Falha no cadastro. Credenciais invalidas ou email ja esta em uso.',
      );
    }

    const hashedPassword = await this.hashProvider.hash(data.password);
    data.password = hashedPassword;
    const createdUser = await this.userRepository.create(data);

    const tokenPayload = { user_id: createdUser.id, type: 'access' };
    const accessToken = this.jwtProvider.signAccessToken(tokenPayload);
    const refreshToken = this.jwtProvider.signRefreshToken({ user_id: createdUser.id, type: 'refresh' });

    await this.producerProvider.createJob(
      QueueNames.SEND_WELCOME_EMAIL,
      { user_id: createdUser.id } as WelcomeEmailJobPayloadDTO,
      bullmqConfig.defaultJobOptions,
    );

    return {
      message: 'Register successful.',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }
}
export { RegisterService };
