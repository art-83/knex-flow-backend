import { inject, injectable } from 'tsyringe';
import { IUserPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import { IUserRepositoryProvider } from '../../infra/orm/repositories/providers/user-repository.provider';
import { IOrganizationRepositoryProvider } from '../../infra/orm/repositories/providers/organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../infra/orm/repositories/providers/permission-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { CreateOrUpdateUserPermissionDTO } from '../../dtos/user-permission/create-or-update-user-permission.dto';
import { UserPermissionQueryOptions } from '../../dtos/user-permission/user-permission-query-options';
import { AuthorizeOrganizationActionService } from '../../../../shared/infra/http/authorization';
import { PermissionDescriptionEnum } from '../../infra/orm/enums/permission-description.enum';

@injectable()
class UserPermissionCrudService {
  constructor(
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
    @inject('UserRepositoryProvider')
    private userRepository: IUserRepositoryProvider,
    @inject('OrganizationRepositoryProvider')
    private organizationRepository: IOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    private authorizeOrganizationActionService: AuthorizeOrganizationActionService,
  ) {}

  public async create(user_id: string, data: CreateOrUpdateUserPermissionDTO) {
    await this.authorizeOrganizationActionService.authorize(
      user_id,
      data.organization_id,
      PermissionDescriptionEnum.USER_PERMISSION_CREATE,
    );

    const user = (await this.userRepository.find({ id: data.user_id })).at(0);

    if (!user) {
      throw new AppError(404, 'User not found.', 'Usuario nao encontrado.');
    }

    const organization = (await this.organizationRepository.find({ id: data.organization_id })).at(0);

    if (!organization) {
      throw new AppError(404, 'Organization not found.', 'Organizacao nao encontrada.');
    }

    const permission = (await this.permissionRepository.find({ id: data.permission_id })).at(0);

    if (!permission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    await this.authorizeOrganizationActionService.ensureUserBelongsToOrganization(data.user_id, data.organization_id);

    const conflictingRelation = (
      await this.userPermissionRepository.find({
        user_id: data.user_id,
        organization_id: data.organization_id,
        permission_id: data.permission_id,
      })
    ).at(0);

    if (conflictingRelation) {
      throw new AppError(409, 'User permission already exists.', 'Permissao do usuario ja existe.');
    }

    const userPermission = await this.userPermissionRepository.create({
      user,
      organization,
      permission,
    });

    return {
      message: 'User permission created successfully.',
      data: userPermission,
    };
  }

  public async find(user_id: string, data: Partial<UserPermissionQueryOptions>) {
    if (!data.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    await this.authorizeOrganizationActionService.authorize(
      user_id,
      data.organization_id,
      PermissionDescriptionEnum.USER_PERMISSION_READ,
    );

    const userPermissions = await this.userPermissionRepository.find(data);

    return {
      message: 'User permissions retrieved successfully.',
      data: userPermissions,
    };
  }

  public async delete(user_id: string, id: string, organization_id: string) {
    await this.authorizeOrganizationActionService.authorize(
      user_id,
      organization_id,
      PermissionDescriptionEnum.USER_PERMISSION_DELETE,
    );

    const existingRelation = (
      await this.userPermissionRepository.find({
        id,
        organization_id,
      })
    ).at(0);

    if (!existingRelation) {
      throw new AppError(404, 'User permission not found.', 'Permissao do usuario nao encontrada.');
    }

    await this.userPermissionRepository.delete(id);

    return {
      message: 'User permission deleted successfully.',
    };
  }
}
export { UserPermissionCrudService };
