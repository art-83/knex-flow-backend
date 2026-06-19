import path from 'node:path';
import { defineConfig } from 'vitest/config';

const rootDir = path.resolve(__dirname, '../..');

export default defineConfig({
  root: rootDir,
  test: {
    name: 'e2e',
    globals: true,
    environment: 'node',
    include: ['tests/e2e/**/*.spec.ts'],
    setupFiles: ['tests/setup/vitest.setup.ts', 'tests/setup/integration.setup.ts'],
    globalSetup: ['tests/setup/global-setup.ts'],
    fileParallelism: false,
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
});
