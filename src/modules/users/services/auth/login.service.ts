import { inject, injectable } from 'tsyringe';
import IHashProvider from '../../infra/providers/hash/providers/hash.provider';
import IJwtProvider from '../../infra/providers/jwt/providers/jwt.provider';
import IUserRepositoryProvider from '../../infra/orm/repositories/providers/user-repository.provider';
import LoginDTO from '../../dtos/auth/login.dto';
import LoginResponseDTO from '../../dtos/auth/login-response.dto';
import AppError from '../../../../shared/infra/http/errors/app-error';

@injectable()
class LoginService {
  constructor(
    @inject('UserRepositoryProvider')
    private userRepository: IUserRepositoryProvider,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('JwtProvider')
    private jwtProvider: IJwtProvider,
  ) {}

  public async execute(data: LoginDTO): Promise<LoginResponseDTO> {
    const users = await this.userRepository.find({ email: data.email, includePassword: true });
    const user = users.at(0);

    if (!user) {
      throw new AppError(401, 'Invalid email or password.');
    }

    const passwordMatches = await this.hashProvider.compare(data.password, user.password);

    if (!passwordMatches) {
      throw new AppError(401, 'Invalid email or password.');
    }

    const tokenPayload = { user_id: user.id };
    const accessToken = this.jwtProvider.signAccessToken(tokenPayload);
    const refreshToken = this.jwtProvider.signRefreshToken(tokenPayload);

    return {
      message: 'Login successful.',
      data: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export default LoginService;
