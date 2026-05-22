import { inject, injectable } from 'tsyringe';
import IUserRepositoryProvider from '../../infra/orm/repositories/providers/user-repository.provider';
import IUserPermissionRepositoryProvider from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import IUserOrganizationRepositoryProvider from '../../infra/orm/repositories/providers/user-organization-repository.provider';

@injectable()
class GetMeService {
  constructor(
    @inject('UserRepositoryProvider')
    private userRepository: IUserRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
  ) {}

  async execute(userId: string) {
    const [user, userPermissions, userOrganizations] = await Promise.all([
      this.userRepository.find({ id: userId }),
      this.userPermissionRepository.find({ user_id: userId }),
      this.userOrganizationRepository.find({ user_id: userId }),
    ]);

    const response = {
      message: 'User retrieved successfully.',
      data: {
        user,
        userPermissions,
        userOrganizations,
      },
    };

    return response;
  }
}

export default GetMeService;
