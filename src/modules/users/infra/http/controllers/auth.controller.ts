import { Request, Response } from 'express';
import { container } from 'tsyringe';
import LoginService from '../../../services/auth/login.service';
import RefreshTokenService from '../../../services/auth/refresh-token.service';
import RegisterService from '../../../services/auth/register.service';

class AuthController {
  public async login(request: Request, response: Response) {
    const loginService = container.resolve(LoginService);
    const result = await loginService.execute(request.body);
    return response.json(result);
  }

  public async register(request: Request, response: Response) {
    const registerService = container.resolve(RegisterService);
    const result = await registerService.execute(request.body);
    return response.status(201).json(result);
  }

  public async refresh(request: Request, response: Response) {
    const refreshTokenService = container.resolve(RefreshTokenService);
    const result = await refreshTokenService.execute(request.body);
    return response.json(result);
  }
}

export default AuthController;
