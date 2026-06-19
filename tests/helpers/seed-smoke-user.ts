import { container } from 'tsyringe';

import { IUserRepositoryProvider } from '@/modules/users/infra/orm/repositories/providers/user-repository.provider';
import { IHashProvider } from '@/modules/users/infra/hash/providers/hash.provider';

const SMOKE_EMAIL = process.env.SMOKE_EMAIL ?? 'smoke@test.example.com';
const SMOKE_PASSWORD = process.env.SMOKE_PASSWORD ?? 'Test123!';

async function seedSmokeUser(): Promise<void> {
  const userRepository = container.resolve<IUserRepositoryProvider>('UserRepositoryProvider');
  const hashProvider = container.resolve<IHashProvider>('HashProvider');
  const existingUsers = await userRepository.find({ email: SMOKE_EMAIL });

  if (existingUsers.length > 0) {
    return;
  }

  const password = await hashProvider.hash(SMOKE_PASSWORD);
  await userRepository.create({ email: SMOKE_EMAIL, password });
}

export { seedSmokeUser };
