import { Agent } from 'supertest';
import { container } from 'tsyringe';

import { IUserRepositoryProvider } from '../../src/modules/users/infra/orm/repositories/providers/user-repository.provider';
import { IOrganizationRepositoryProvider } from '../../src/modules/users/infra/orm/repositories/providers/organization-repository.provider';
import { IUserOrganizationRepositoryProvider } from '../../src/modules/users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../src/modules/users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../src/modules/users/infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../src/modules/users/infra/orm/enums/permission-description.enum';
import { IHashProvider } from '../../src/modules/users/infra/hash/providers/hash.provider';
import { GetTicketsAvaliabilityAndMaybeCreateOrderService } from '../../src/modules/events/services/tickets/find-tickets-avaliability-and-maybe-create-order.service';
import { TEST_ADMIN_EMAIL, TEST_PASSWORD, TEST_USER_EMAIL } from './constants';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

async function registerAndLogin(agent: Agent, email = TEST_USER_EMAIL, password = TEST_PASSWORD): Promise<AuthTokens> {
  const registerResponse = await agent.post('/auth/register').send({ email, password }).expect(201);

  return registerResponse.body.data as AuthTokens;
}

async function seedAdminWithOrganization(options?: {
  email?: string;
  password?: string;
  organizationName?: string;
}): Promise<{ userId: string; organizationId: string; accessToken: string }> {
  const email = options?.email ?? TEST_ADMIN_EMAIL;
  const password = options?.password ?? TEST_PASSWORD;
  const organizationName = options?.organizationName ?? 'Test Organization';

  const userRepository = container.resolve<IUserRepositoryProvider>('UserRepositoryProvider');
  const organizationRepository = container.resolve<IOrganizationRepositoryProvider>('OrganizationRepositoryProvider');
  const userOrganizationRepository = container.resolve<IUserOrganizationRepositoryProvider>(
    'UserOrganizationRepositoryProvider',
  );
  const permissionRepository = container.resolve<IPermissionRepositoryProvider>('PermissionRepositoryProvider');
  const userPermissionRepository = container.resolve<IUserPermissionRepositoryProvider>(
    'UserPermissionRepositoryProvider',
  );
  const hashProvider = container.resolve<IHashProvider>('HashProvider');

  const hashedPassword = await hashProvider.hash(password);
  const user = await userRepository.create({ email, password: hashedPassword });
  const organization = await organizationRepository.create({ name: organizationName });

  await userOrganizationRepository.create({
    user,
    organization,
  });

  const permissionDescriptions = Object.values(PermissionDescriptionEnum);

  for (const description of permissionDescriptions) {
    const permission = (await permissionRepository.find({ description })).at(0);

    if (!permission) {
      continue;
    }

    await userPermissionRepository.create({
      user,
      organization,
      permission,
    });
  }

  const { LoginService } = await import('../../src/modules/users/services/authentication/login.service');
  const loginService = container.resolve(LoginService);
  const loginResult = await loginService.execute({ email, password });

  return {
    userId: user.id,
    organizationId: organization.id,
    accessToken: loginResult.data.accessToken,
  };
}

async function createPendingOrderForUser(userId: string, eventId: string): Promise<string> {
  const service = container.resolve(GetTicketsAvaliabilityAndMaybeCreateOrderService);
  const result = await service.execute(userId, eventId);

  if (!result.data?.order?.id) {
    throw new Error('Failed to create pending order for test setup.');
  }

  return result.data.order.id;
}

export { registerAndLogin, seedAdminWithOrganization, createPendingOrderForUser, AuthTokens };
export { buildAbacatepayWebhookPayload } from './webhook-fixtures';
