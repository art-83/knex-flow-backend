import { loadTestEnv } from '../helpers/load-env';
import { startDockerComposeTestStack } from '../helpers/docker-compose-test';
import { registerTestContainer } from '../helpers/register-test-container';

loadTestEnv();

async function main() {
  startDockerComposeTestStack();
  registerTestContainer({ useFakeExternals: true });

  const { createApp } = await import('../../src/shared/infra/http/create-app');
  const port = Number(process.env.HTTP_PORT ?? 3000);

  await createApp({ port });

  const { seedSmokeUser } = await import('../helpers/seed-smoke-user');
  await seedSmokeUser();

  console.log(`Test server listening on http://localhost:${port}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
