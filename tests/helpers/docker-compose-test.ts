import { execSync, execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const rootDir = resolve(__dirname, '../..');
const composeFile = resolve(rootDir, 'docker-compose.test.yml');
const projectName = 'knex-flow-test';

function dockerCommand(args: string[]): string {
  const useSudo = process.env.DOCKER_USE_SUDO === 'true';
  const dockerBin = useSudo ? 'sudo docker' : 'docker';

  return [dockerBin, 'compose', '-p', projectName, '-f', composeFile, ...args].join(' ');
}

function assertDockerAvailable(): void {
  if (process.env.TEST_SKIP_DOCKER_COMPOSE === 'true') {
    return;
  }

  const useSudo = process.env.DOCKER_USE_SUDO === 'true';
  const dockerArgs = useSudo ? ['sudo', 'docker'] : ['docker'];

  try {
    execFileSync(dockerArgs[0], [...dockerArgs.slice(1), 'info'], { stdio: 'ignore' });
  } catch {
    const hint = [
      '[test-infra] Docker não está acessível para este usuário.',
      '',
      'No Arch Linux, adicione seu usuário ao grupo docker e reabra o terminal:',
      '  sudo usermod -aG docker $USER',
      '  newgrp docker',
      '',
      'Alternativas temporárias:',
      '  DOCKER_USE_SUDO=true npm run test:integration',
      '  TEST_SKIP_DOCKER_COMPOSE=true npm run test:integration  # stack já rodando',
    ].join('\n');

    throw new Error(hint);
  }
}

function runCompose(args: string[]): void {
  const command = dockerCommand(args);

  execSync(command, {
    cwd: rootDir,
    stdio: 'inherit',
  });
}

function startDockerComposeTestStack(): void {
  if (process.env.TEST_SKIP_DOCKER_COMPOSE === 'true') {
    console.log('[test-infra] Skipping docker compose up (TEST_SKIP_DOCKER_COMPOSE=true)');
    return;
  }

  assertDockerAvailable();

  console.log('[test-infra] Starting docker-compose.test.yml...');
  runCompose(['up', '-d', '--wait']);
  console.log('[test-infra] Test stack is ready.');
}

function stopDockerComposeTestStack(): void {
  if (process.env.TEST_SKIP_DOCKER_COMPOSE === 'true') {
    return;
  }

  console.log('[test-infra] Stopping docker-compose.test.yml...');
  runCompose(['down', '-v', '--remove-orphans']);
  console.log('[test-infra] Test stack stopped.');
}

export { startDockerComposeTestStack, stopDockerComposeTestStack };
