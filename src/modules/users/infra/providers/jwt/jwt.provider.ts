import JwtPayloadDTO from '../../../dtos/auth/jwt-payload.dto';

interface IJwtProvider {
  signAccessToken(payload: JwtPayloadDTO): string;
  signRefreshToken(payload: JwtPayloadDTO): string;
  verifyRefreshToken(token: string): JwtPayloadDTO;
}

export default IJwtProvider;
