import { inject, injectable } from 'tsyringe';
import IUserPermissionRepositoryProvider from '../../infra/orm/repositories/providers/user-permission-repository.provider';
import IUserRepositoryProvider from '../../infra/orm/repositories/providers/user-repository.provider';
import IOrganizationRepositoryProvider from '../../infra/orm/repositories/providers/organization-repository.provider';
import IPermissionRepositoryProvider from '../../infra/orm/repositories/providers/permission-repository.provider';
import IUserOrganizationRepositoryProvider from '../../infra/orm/repositories/providers/user-organization-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import CreateOrUpdateUserPermissionDTO from '../../dtos/user-permission/create-or-update-user-permission.dto';
import UserPermissionQueryOptions from '../../dtos/user-permission/user-permission-query-options';
import EnsureUserOrganizationAccessService from '../authorization/ensure-user-organization-access.service';
import EnsureUserHasPermissionService from '../authorization/ensure-user-has-permission.service';
import PermissionDescriptionEnum from '../../enums/permission-description.enum';

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
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    private ensureUserOrganizationAccessService: EnsureUserOrganizationAccessService,
    private ensureUserHasPermissionService: EnsureUserHasPermissionService,
  ) {}

  private isUniqueViolation(error: unknown): boolean {
    return Boolean(
      error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === '23505',
    );
  }

  public async create(user_id: string, data: CreateOrUpdateUserPermissionDTO) {
    await this.ensureUserOrganizationAccessService.execute(user_id, data.organization_id);
    await this.ensureUserHasPermissionService.execute(
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

    const targetUserInOrganization = (
      await this.userOrganizationRepository.find({
        user_id: data.user_id,
        organization_id: data.organization_id,
      })
    ).at(0);

    if (!targetUserInOrganization) {
      throw new AppError(
        400,
        'Target user does not belong to this organization.',
        'Usuario alvo nao pertence a esta organizacao.',
      );
    }

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

    let userPermission;

    try {
      userPermission = await this.userPermissionRepository.create({
        user,
        organization,
        permission,
      });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new AppError(409, 'User permission already exists.', 'Permissao do usuario ja existe.');
      }

      throw error;
    }

    return {
      message: 'User permission created successfully.',
      data: userPermission,
    };
  }

  public async find(user_id: string, data: Partial<UserPermissionQueryOptions>) {
    if (!data.organization_id) {
      throw new AppError(400, 'organization_id is required.', 'organization_id e obrigatorio.');
    }

    await this.ensureUserOrganizationAccessService.execute(user_id, data.organization_id);
    await this.ensureUserHasPermissionService.execute(
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

  public async update(user_id: string, id: string, data: CreateOrUpdateUserPermissionDTO) {
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

    const targetUserInOrganization = (
      await this.userOrganizationRepository.find({
        user_id: data.user_id,
        organization_id: data.organization_id,
      })
    ).at(0);

    if (!targetUserInOrganization) {
      throw new AppError(
        400,
        'Target user does not belong to this organization.',
        'Usuario alvo nao pertence a esta organizacao.',
      );
    }

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

    let userPermission;

    try {
      userPermission = await this.userPermissionRepository.update(id, {
        ...existingRelation,
        user,
        organization,
        permission,
      });
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new AppError(409, 'User permission already exists.', 'Permissao do usuario ja existe.');
      }

      throw error;
    }

    return {
      message: 'User permission updated successfully.',
      data: userPermission,
    };
  }

  public async delete(user_id: string, id: string, organization_id: string) {
    await this.ensureUserOrganizationAccessService.execute(user_id, organization_id);
    await this.ensureUserHasPermissionService.execute(
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

export default UserPermissionCrudService;
