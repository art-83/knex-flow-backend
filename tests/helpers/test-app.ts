import { Express } from 'express';
import request, { Agent } from 'supertest';

import { CreateAppResult } from '../../src/shared/infra/http/create-app';

let appContext: CreateAppResult | null = null;

async function bootstrapTestApp(): Promise<CreateAppResult> {
  if (appContext) {
    return appContext;
  }

  const { createApp } = await import('../../src/shared/infra/http/create-app');
  appContext = await createApp();
  return appContext;
}

async function shutdownTestApp(): Promise<void> {
  if (!appContext) {
    return;
  }

  await appContext.shutdown();
  appContext = null;
}

function getTestApp(): Express {
  if (!appContext) {
    throw new Error('Test app not bootstrapped. Call bootstrapTestApp() first.');
  }

  return appContext.app;
}

function getTestAgent(): Agent {
  return request(getTestApp());
}

export { bootstrapTestApp, shutdownTestApp, getTestApp, getTestAgent };
