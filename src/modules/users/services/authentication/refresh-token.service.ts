import { inject, injectable } from 'tsyringe';
import { IJwtProvider } from '../../infra/jwt/providers/jwt.provider';
import { RefreshTokenDTO } from '../../dtos/auth/refresh-token.dto';
import { RefreshTokenResponseDTO } from '../../dtos/auth/refresh-token-response.dto';
import { AppError } from '../../../../shared/infra/http/errors/app-error';

@injectable()
class RefreshTokenService {
  constructor(
    @inject('JwtProvider')
    private jwtProvider: IJwtProvider,
  ) {}

  public async execute(data: RefreshTokenDTO): Promise<RefreshTokenResponseDTO> {
    try {
      const decoded = this.jwtProvider.verifyRefreshToken(data.refreshToken);

      const accessToken = this.jwtProvider.signAccessToken({
        user_id: decoded.user_id,
        type: decoded.type ?? 'access',
      });

      return {
        message: 'Token refreshed successfully.',
        data: { accessToken },
      };
    } catch {
      throw new AppError(401, 'Invalid or expired refresh token.', 'Refresh token invalido ou expirado.');
    }
  }
}
export { RefreshTokenService };
