import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import LoginService from '../../../services/auth/login.service';
import RefreshTokenService from '../../../services/auth/refresh-token.service';

class AuthController {
  public async login(request: Request, response: Response, next: NextFunction) {
    try {
      const loginService = container.resolve(LoginService);
      const result = await loginService.execute(request.body);
      return response.json(result);
    } catch (error) {
      next(error);
    }
  }

  public async refresh(request: Request, response: Response, next: NextFunction) {
    try {
      const refreshTokenService = container.resolve(RefreshTokenService);
      const result = await refreshTokenService.execute(request.body);
      return response.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
