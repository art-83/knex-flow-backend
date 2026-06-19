import { beforeAll, afterAll, afterEach } from 'vitest';
import { container } from 'tsyringe';

import { loadTestEnv } from '../helpers/load-env';
import { registerTestContainer, resetTestFakes, reRegisterTestFakes } from '../helpers/register-test-container';
import { bootstrapTestApp, shutdownTestApp } from '../helpers/test-app';
import { resetDatabase } from '../helpers/db-reset';

loadTestEnv();

beforeAll(async () => {
  registerTestContainer({ useFakeExternals: true });
  await bootstrapTestApp();
});

afterEach(async () => {
  await resetDatabase();
  resetTestFakes();
  container.clearInstances();
  reRegisterTestFakes();
});

afterAll(async () => {
  await shutdownTestApp();
});
