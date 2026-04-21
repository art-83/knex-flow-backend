import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import IJwtProvider from '../../../../modules/users/infra/jwt/providers/jwt.provider';

function authMiddleware(request: Request, response: Response, next: NextFunction): void {
  try {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      response.status(401).json({ error: 'Missing authorization header' });
      return;
    }

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer') {
      response.status(401).json({ error: 'Invalid authorization scheme' });
      return;
    }

    if (!token) {
      response.status(401).json({ error: 'Missing token' });
      return;
    }

    const jwtProvider = container.resolve<IJwtProvider>('JwtProvider');
    const payload = jwtProvider.verifyAccessToken(token);

    request.user_id = payload.user_id;

    next();
  } catch (error) {
    response.status(401).json({ error: 'Invalid token' });
  }
}

export default authMiddleware;
