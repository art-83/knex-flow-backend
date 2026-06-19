import { describe, it, expect, vi, beforeEach } from 'vitest';
import { container } from 'tsyringe';

import { RegisterService } from '../../src/modules/users/services/authentication/register.service';
import { IUserRepositoryProvider } from '../../src/modules/users/infra/orm/repositories/providers/user-repository.provider';
import { IHashProvider } from '../../src/modules/users/infra/hash/providers/hash.provider';
import { IJwtProvider } from '../../src/modules/users/infra/jwt/providers/jwt.provider';
import { IProducerProvider } from '../../src/shared/infra/queue/infra/providers/producer.provider';
import { User } from '../../src/modules/users/infra/orm/entities/user.entity';
import { QueueNames } from '../../src/shared/infra/queue/enums/queues-names.enum';
import { TEST_PASSWORD } from '../helpers/constants';

describe('RegisterService', () => {
  const userRepository = {
    find: vi.fn(),
    create: vi.fn(),
  };

  const hashProvider = {
    hash: vi.fn(),
    compare: vi.fn(),
  };

  const jwtProvider = {
    signAccessToken: vi.fn(),
    signRefreshToken: vi.fn(),
  };

  const producerProvider = {
    createJob: vi.fn(),
    close: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    container.reset();
    container.registerInstance<IUserRepositoryProvider>('UserRepositoryProvider', userRepository);
    container.registerInstance<IHashProvider>('HashProvider', hashProvider);
    container.registerInstance<IJwtProvider>('JwtProvider', jwtProvider);
    container.registerInstance<IProducerProvider>('ProducerProvider', producerProvider);
  });

  it('registers user, enqueues welcome email and returns tokens', async () => {
    userRepository.find.mockResolvedValue([]);
    hashProvider.hash.mockResolvedValue('hashed-password');
    userRepository.create.mockResolvedValue({ id: 'user-1', email: 'new@test.com' } as User);
    jwtProvider.signAccessToken.mockReturnValue('access-token');
    jwtProvider.signRefreshToken.mockReturnValue('refresh-token');

    const service = container.resolve(RegisterService);
    const result = await service.execute({ email: 'new@test.com', password: TEST_PASSWORD });

    expect(result.data.accessToken).toBe('access-token');
    expect(producerProvider.createJob).toHaveBeenCalledWith(
      QueueNames.SEND_WELCOME_EMAIL,
      expect.objectContaining({ user_id: 'user-1' }),
    );
  });

  it('rejects weak passwords', async () => {
    const service = container.resolve(RegisterService);

    await expect(service.execute({ email: 'new@test.com', password: 'weak' })).rejects.toThrow();
  });
});
