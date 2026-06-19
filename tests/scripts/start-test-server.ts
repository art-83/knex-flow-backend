import 'reflect-metadata';

import { loadTestEnv } from '../helpers/load-env';

loadTestEnv();

async function main() {
  const { startDockerComposeTestStack } =
    require('../helpers/docker-compose-test') as typeof import('../helpers/docker-compose-test');
  const { registerTestContainer } =
    require('../helpers/register-test-container') as typeof import('../helpers/register-test-container');

  startDockerComposeTestStack();
  registerTestContainer({ useFakeExternals: true });

  const { createApp } =
    require('../../src/shared/infra/http/create-app') as typeof import('../../src/shared/infra/http/create-app');
  const port = Number(process.env.HTTP_PORT ?? 3000);

  await createApp({ port });

  const { seedSmokeUser } = require('../helpers/seed-smoke-user') as typeof import('../helpers/seed-smoke-user');
  await seedSmokeUser();

  console.log(`Test server listening on http://localhost:${port}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
