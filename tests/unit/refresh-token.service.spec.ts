import { describe, it, expect, vi, beforeEach } from 'vitest';
import { container } from 'tsyringe';

import { RefreshTokenService } from '../../src/modules/users/services/authentication/refresh-token.service';
import { IJwtProvider } from '../../src/modules/users/infra/jwt/providers/jwt.provider';
import { AppError } from '../../src/shared/infra/http/errors/app-error';

describe('RefreshTokenService', () => {
  const jwtProvider = {
    verifyRefreshToken: vi.fn(),
    signAccessToken: vi.fn(),
    signRefreshToken: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    container.reset();
    container.registerInstance<IJwtProvider>('JwtProvider', jwtProvider);
  });

  it('returns a new access token for valid refresh token', async () => {
    jwtProvider.verifyRefreshToken.mockReturnValue({ user_id: 'user-1', type: 'refresh' });
    jwtProvider.signAccessToken.mockReturnValue('new-access-token');

    const service = container.resolve(RefreshTokenService);
    const result = await service.execute({ refreshToken: 'valid-refresh-token' });

    expect(result.data.accessToken).toBe('new-access-token');
  });

  it('throws for invalid refresh token', async () => {
    jwtProvider.verifyRefreshToken.mockImplementation(() => {
      throw new Error('invalid token');
    });

    const service = container.resolve(RefreshTokenService);

    await expect(service.execute({ refreshToken: 'invalid' })).rejects.toBeInstanceOf(AppError);
  });
});
