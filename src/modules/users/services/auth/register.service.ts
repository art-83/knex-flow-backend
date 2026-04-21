import { inject, injectable } from 'tsyringe';
import IHashProvider from '../../infra/providers/hash/providers/hash.provider';
import IJwtProvider from '../../infra/providers/jwt/providers/jwt.provider';
import IUserRepositoryProvider from '../../infra/orm/repositories/providers/user-repository.provider';
import RegisterDTO from '../../dtos/auth/register.dto';
import LoginResponseDTO from '../../dtos/auth/login-response.dto';
import AppError from '../../../../shared/infra/http/errors/app-error';
import validatePasswordStrength from '../../utils/validate-password-strength';
import { User } from '../../infra/orm/entities/user.entity';

@injectable()
class RegisterService {
  constructor(
    @inject('UserRepositoryProvider')
    private userRepository: IUserRepositoryProvider,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('JwtProvider')
    private jwtProvider: IJwtProvider,
  ) {}

  public async execute(data: RegisterDTO): Promise<LoginResponseDTO> {
    try {
      const passwordValidation = validatePasswordStrength(data.password);
      if (!passwordValidation.isValid) {
        throw new AppError(400, 'Failed to register. Invalid credentials or email already in use.');
      }

      const existingUsers = await this.userRepository.find({ email: data.email });
      if (existingUsers.length > 0) {
        throw new AppError(400, 'Failed to register. Invalid credentials or email already in use.');
      }

      const hashedPassword = await this.hashProvider.hash(data.password);

      const user = new User();
      user.email = data.email;
      user.password = hashedPassword;

      const createdUser = await this.userRepository.create(user);

      const tokenPayload = { user_id: createdUser.id };
      const accessToken = this.jwtProvider.signAccessToken(tokenPayload);
      const refreshToken = this.jwtProvider.signRefreshToken(tokenPayload);

      return {
        message: 'Register successful.',
        data: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(400, 'Failed to register. Invalid credentials or email already in use.');
    }
  }
}

export default RegisterService;
