import jwt, { Secret } from 'jsonwebtoken';
import IJwtProvider from './jwt.provider';

class JsonWebTokenJwtProvider implements IJwtProvider {
  private secret: Secret;
  private expiresIn: string;
  private refreshSecret: Secret;
  private refreshExpiresIn: string;

  constructor() {
    this.secret = String(process.env.JWT_SECRET);
    this.expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    this.refreshSecret = String(process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  public signAccessToken(payload: object): string {
    return (jwt.sign as any)(payload, this.secret, { expiresIn: this.expiresIn });
  }

  public signRefreshToken(payload: object): string {
    return (jwt.sign as any)(payload, this.refreshSecret, { expiresIn: this.refreshExpiresIn });
  }

  public verifyRefreshToken(token: string): object {
    return jwt.verify(token, this.refreshSecret) as object;
  }
}

export default JsonWebTokenJwtProvider;
