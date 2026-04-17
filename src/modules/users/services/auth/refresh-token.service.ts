import { inject, injectable } from 'tsyringe';
import IJwtProvider from '../../infra/providers/jwt/jwt.provider';
import RefreshTokenDTO from '../../dtos/auth/refresh-token.dto';
import AppError from '../../../../shared/infra/http/errors/app-error';

@injectable()
class RefreshTokenService {
  constructor(
    @inject('JwtProvider')
    private jwtProvider: IJwtProvider,
  ) {}

  public async execute(data: RefreshTokenDTO) {
    try {
      const decoded = this.jwtProvider.verifyRefreshToken(data.refreshToken) as {
        id: string;
        email: string;
      };

      const accessToken = this.jwtProvider.signAccessToken({
        id: decoded.id,
        email: decoded.email,
      });

      return {
        message: 'Token refreshed successfully.',
        data: { accessToken },
      };
    } catch {
      throw new AppError(401, 'Invalid or expired refresh token.');
    }
  }
}

export default RefreshTokenService;
