import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { GetMeService } from '../../../services/me/get-me.service';
import { FindUsersService } from '../../../services/users/find-users.service';

class UsersController {
  public async find(request: Request, response: Response) {
    const findUsersService = container.resolve(FindUsersService);
    const organization_id = String(request.query.organization_id);
    const result = await findUsersService.execute(request.user_id, { organization_id });
    return response.json(result);
  }

  public async me(request: Request, response: Response) {
    const getMeService = container.resolve(GetMeService);
    const result = await getMeService.execute(request.user_id);
    return response.json(result);
  }
}
export { UsersController };
