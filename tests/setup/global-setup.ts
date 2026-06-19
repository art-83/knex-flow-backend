import { loadTestEnv } from '../helpers/load-env';
import { startDockerComposeTestStack, stopDockerComposeTestStack } from '../helpers/docker-compose-test';

export default async function globalSetup(): Promise<() => Promise<void>> {
  loadTestEnv();
  startDockerComposeTestStack();

  return async () => {
    stopDockerComposeTestStack();
  };
}
