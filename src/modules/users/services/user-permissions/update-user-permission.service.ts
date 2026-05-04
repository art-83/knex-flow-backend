import { inject, injectable } from 'tsyringe';
import IUserPermissionRepositoryProvider from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import IUserRepositoryProvider from '../../infra/orm/repositories/providers/user-repository.provider';
import IOrganizationRepositoryProvider from '../../infra/orm/repositories/providers/organization-repository.provider';
import IPermissionRepositoryProvider from '../../infra/orm/repositories/providers/permission-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import CreateOrUpdateUserPermissionDTO from '../../dtos/user-permission/create-or-update-user-permission.dto';
import EnsureUserOrganizationAccessService from '../../../../shared/infra/http/authorization/ensure-user-organization-access.service';
import EnsureUserHasPermissionService from '../../../../shared/infra/http/authorization/ensure-user-has-permission.service';
import PermissionDescriptionEnum from '../../enums/permission-description.enum';

@injectable()
class UpdateUserPermissionService {
  constructor(
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
    @inject('UserRepositoryProvider')
    private userRepository: IUserRepositoryProvider,
    @inject('OrganizationRepositoryProvider')
    private organizationRepository: IOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    private ensureUserOrganizationAccessService: EnsureUserOrganizationAccessService,
    private ensureUserHasPermissionService: EnsureUserHasPermissionService,
  ) {}

  public async execute(user_id: string, id: string, data: CreateOrUpdateUserPermissionDTO) {
    await this.ensureUserOrganizationAccessService.execute(user_id, data.organization_id);
    await this.ensureUserHasPermissionService.execute(
      user_id,
      data.organization_id,
      PermissionDescriptionEnum.USER_PERMISSION_UPDATE,
    );

    const existingRelation = (
      await this.userPermissionRepository.find({
        id,
        organization_id: data.organization_id,
      })
    ).at(0);

    if (!existingRelation) {
      throw new AppError(404, 'User permission not found.', 'Permissao do usuario nao encontrada.');
    }

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

    await this.ensureUserOrganizationAccessService.execute(data.user_id, data.organization_id, 'subject');

    const conflictingRelation = (
      await this.userPermissionRepository.find({
        user_id: data.user_id,
        organization_id: data.organization_id,
        permission_id: data.permission_id,
      })
    ).find(item => item.id !== id);

    if (conflictingRelation) {
      throw new AppError(409, 'User permission already exists.', 'Permissao do usuario ja existe.');
    }

    const userPermission = await this.userPermissionRepository.update(id, {
      ...existingRelation,
      user,
      organization,
      permission,
    });

    return {
      message: 'User permission updated successfully.',
      data: userPermission,
    };
  }
}

export default UpdateUserPermissionService;
