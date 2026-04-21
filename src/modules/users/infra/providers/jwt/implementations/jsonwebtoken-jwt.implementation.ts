import jwt, { Secret } from 'jsonwebtoken';
import IJwtProvider from '../jwt.provider';
import JwtPayloadDTO from '../../../../dtos/auth/jwt-payload.dto';
import jwtConfig from '../../../../../../config/jwt.config';

class JsonWebTokenJwtProvider implements IJwtProvider {
  private secret: Secret;
  private expiresIn: string;
  private refreshSecret: Secret;
  private refreshExpiresIn: string;

  constructor() {
    this.secret = jwtConfig.secret;
    this.expiresIn = jwtConfig.expiresIn;
    this.refreshSecret = jwtConfig.refreshSecret;
    this.refreshExpiresIn = jwtConfig.refreshExpiresIn;
  }

  public signAccessToken(payload: JwtPayloadDTO): string {
    return (jwt.sign as any)(payload, this.secret, { expiresIn: this.expiresIn });
  }

  public signRefreshToken(payload: JwtPayloadDTO): string {
    return (jwt.sign as any)(payload, this.refreshSecret, { expiresIn: this.refreshExpiresIn });
  }

  public verifyRefreshToken(token: string): JwtPayloadDTO {
    return jwt.verify(token, this.refreshSecret) as JwtPayloadDTO;
  }
}

export default JsonWebTokenJwtProvider;
