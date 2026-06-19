import { describe, it, expect, vi, beforeEach } from 'vitest';
import { container } from 'tsyringe';

import { LoginService } from '../../src/modules/users/services/authentication/login.service';
import { AppError } from '../../src/shared/infra/http/errors/app-error';
import { IUserRepositoryProvider } from '../../src/modules/users/infra/orm/repositories/providers/user-repository.provider';
import { IHashProvider } from '../../src/modules/users/infra/hash/providers/hash.provider';
import { IJwtProvider } from '../../src/modules/users/infra/jwt/providers/jwt.provider';
import { User } from '../../src/modules/users/infra/orm/entities/user.entity';

describe('LoginService', () => {
  const userRepository = {
    find: vi.fn(),
  };

  const hashProvider = {
    compare: vi.fn(),
    hash: vi.fn(),
  };

  const jwtProvider = {
    signAccessToken: vi.fn(),
    signRefreshToken: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    container.reset();
    container.registerInstance<IUserRepositoryProvider>('UserRepositoryProvider', userRepository);
    container.registerInstance<IHashProvider>('HashProvider', hashProvider);
    container.registerInstance<IJwtProvider>('JwtProvider', jwtProvider);
  });

  it('returns tokens when credentials are valid', async () => {
    const user = { id: 'user-1', email: 'user@test.com', password: 'hashed' } as User;
    userRepository.find.mockResolvedValue([user]);
    hashProvider.compare.mockResolvedValue(true);
    jwtProvider.signAccessToken.mockReturnValue('access-token');
    jwtProvider.signRefreshToken.mockReturnValue('refresh-token');

    const service = container.resolve(LoginService);
    const result = await service.execute({ email: 'user@test.com', password: 'Test123!' });

    expect(result.data.accessToken).toBe('access-token');
    expect(result.data.refreshToken).toBe('refresh-token');
    expect(userRepository.find).toHaveBeenCalledWith({ email: 'user@test.com', includePassword: true });
  });

  it('throws when user does not exist', async () => {
    userRepository.find.mockResolvedValue([]);

    const service = container.resolve(LoginService);

    await expect(service.execute({ email: 'missing@test.com', password: 'Test123!' })).rejects.toBeInstanceOf(AppError);
  });

  it('throws when password does not match', async () => {
    const user = { id: 'user-1', email: 'user@test.com', password: 'hashed' } as User;
    userRepository.find.mockResolvedValue([user]);
    hashProvider.compare.mockResolvedValue(false);

    const service = container.resolve(LoginService);

    await expect(service.execute({ email: 'user@test.com', password: 'wrong' })).rejects.toBeInstanceOf(AppError);
  });
});
