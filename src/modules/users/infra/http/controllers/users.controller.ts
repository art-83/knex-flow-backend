import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetMeService } from '../../../services/me/get-me.service';

class UsersController {
  public async me(request: Request, response: Response) {
    const getMeService = container.resolve(GetMeService);
    const result = await getMeService.execute(request.user_id);
    return response.json(result);
  }
}
export { UsersController };
