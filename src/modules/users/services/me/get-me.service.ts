import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IUserRepositoryProvider } from '../../infra/orm/repositories/providers/user-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import { IUserOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/user-organization-repository.provider';
import { UserOrganization } from '../../infra/orm/entities/user-organization.entity';

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
    const [users, userPermissions, userOrganizations] = await Promise.all([
      this.userRepository.find({ id: userId }),
      this.userPermissionRepository.find({ user_id: userId }),
      this.userOrganizationRepository.find({ user_id: userId }),
    ]);

    const user = users.at(0);

    if (!user) {
      throw new AppError(404, 'User not found.', 'Usuario nao encontrado.');
    }

    const mappedOrganizations = userOrganizations.map(organization => this.mapUserOrganization(organization));

    return {
      message: 'User retrieved successfully.',
      data: {
        user: [
          {
            id: user.id,
            email: user.email,
          },
        ],
        user_permissions: userPermissions,
        user_organizations: mappedOrganizations,
        has_organization: mappedOrganizations.length > 0,
      },
    };
  }

  private mapUserOrganization(userOrganization: UserOrganization) {
    return {
      id: userOrganization.id,
      organization: {
        id: userOrganization.organization.id,
        name: userOrganization.organization.name,
        configuration: userOrganization.organization.configuration,
      },
    };
  }
}
export { GetMeService };
