import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import LoginService from '../../../services/auth/login.service';
import RefreshTokenService from '../../../services/auth/refresh-token.service';
import RegisterService from '../../../services/auth/register.service';

@injectable()
class AuthController {
  constructor(
    @inject('LoginService')
    private loginService: LoginService,
    @inject('RefreshTokenService')
    private refreshTokenService: RefreshTokenService,
    @inject('RegisterService')
    private registerService: RegisterService,
  ) {}

  public async login(request: Request, response: Response) {
    const result = await this.loginService.execute(request.body);
    return response.json(result);
  }

  public async register(request: Request, response: Response) {
    const result = await this.registerService.execute(request.body);
    return response.status(201).json(result);
  }

  public async refresh(request: Request, response: Response) {
    const result = await this.refreshTokenService.execute(request.body);
    return response.json(result);
  }
}

export default AuthController;
