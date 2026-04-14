import 'reflect-metadata';

import { container } from 'tsyringe';
import ITable3RepositoryProvider from '../../modules/__example-module__/infra/orm/repositories/providers/table-3-repository.provider';
import Table3Repository from '../../modules/__example-module__/infra/orm/repositories/implementations/table-3-repository.implementation';

import IUserRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/user-repository.provider';
import UserRepository from '../../modules/users/infra/orm/repositories/implementations/user-repository.implementation';

import IOrganizationRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/organization-repository.provider';
import OrganizationRepository from '../../modules/users/infra/orm/repositories/implementations/organization-repository.implementation';

import IUserOrganizationRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/user-organization-repository.provider';
import UserOrganizationRepository from '../../modules/users/infra/orm/repositories/implementations/user-organization-repository.implementation';

import IOrganizationRoleRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/organization-role-repository.provider';
import OrganizationRoleRepository from '../../modules/users/infra/orm/repositories/implementations/organization-role-repository.implementation';

import IOrganizationRolePermissionRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/organization-role-permission-repository.provider';
import OrganizationRolePermissionRepository from '../../modules/users/infra/orm/repositories/implementations/organization-role-permission-repository.implementation';

import IPermissionRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/permission-repository.provider';
import PermissionRepository from '../../modules/users/infra/orm/repositories/implementations/permission-repository.implementation';

import IUserPermissionRepositoryProvider from '../../modules/users/infra/orm/repositories/providers/user-permission-repository.provider';
import UserPermissionRepository from '../../modules/users/infra/orm/repositories/implementations/user-permission-repository.implementation';

container.registerSingleton<ITable3RepositoryProvider>('Table3RepositoryProvider', Table3Repository);

container.registerSingleton<IUserRepositoryProvider>('UserRepositoryProvider', UserRepository);
container.registerSingleton<IOrganizationRepositoryProvider>('OrganizationRepositoryProvider', OrganizationRepository);
container.registerSingleton<IUserOrganizationRepositoryProvider>(
  'UserOrganizationRepositoryProvider',
  UserOrganizationRepository,
);
container.registerSingleton<IOrganizationRoleRepositoryProvider>(
  'OrganizationRoleRepositoryProvider',
  OrganizationRoleRepository,
);
container.registerSingleton<IOrganizationRolePermissionRepositoryProvider>(
  'OrganizationRolePermissionRepositoryProvider',
  OrganizationRolePermissionRepository,
);
container.registerSingleton<IPermissionRepositoryProvider>('PermissionRepositoryProvider', PermissionRepository);
container.registerSingleton<IUserPermissionRepositoryProvider>(
  'UserPermissionRepositoryProvider',
  UserPermissionRepository,
);
