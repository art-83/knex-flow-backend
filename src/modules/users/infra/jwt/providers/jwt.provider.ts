import { JwtPayloadDTO } from '../../../dtos/internal/auth/jwt-payload.dto';

interface IJwtProvider {
  signAccessToken(payload: JwtPayloadDTO): string;
  signRefreshToken(payload: JwtPayloadDTO): string;
  verifyAccessToken(token: string): JwtPayloadDTO;
  verifyRefreshToken(token: string): JwtPayloadDTO;
}
export { IJwtProvider };
