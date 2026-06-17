import { Router } from 'express';
import { organizationRoleRouter } from './organization-role.router';
import { organizationRolePermissionRouter } from './organization-role-permission.router';
import { userPermissionRouter } from './user-permission.router';
import { usesRouter } from './uses.router';

const authorizationRouter = Router();

authorizationRouter.use('/organization-roles', organizationRoleRouter);
authorizationRouter.use('/organization-role-permissions', organizationRolePermissionRouter);
authorizationRouter.use('/user-permissions', userPermissionRouter);
authorizationRouter.use('/', usesRouter);
export { authorizationRouter };
