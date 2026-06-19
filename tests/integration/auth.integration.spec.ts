import { describe, it, expect } from 'vitest';

import { getTestAgent } from '../helpers/test-app';
import { TEST_PASSWORD, TEST_USER_EMAIL } from '../helpers/constants';

describe('Health integration', () => {
  it('GET /health returns ok', async () => {
    const response = await getTestAgent().get('/health').expect(200);

    expect(response.body).toEqual({ status: 'ok' });
  });
});

describe('Auth integration', () => {
  it('registers, logs in and refreshes token', async () => {
    const agent = getTestAgent();

    const registerResponse = await agent
      .post('/auth/register')
      .send({ email: TEST_USER_EMAIL, password: TEST_PASSWORD })
      .expect(201);

    expect(registerResponse.body.data.accessToken).toBeDefined();
    expect(registerResponse.body.data.refreshToken).toBeDefined();

    const loginResponse = await agent
      .post('/auth/login')
      .send({ email: TEST_USER_EMAIL, password: TEST_PASSWORD })
      .expect(200);

    const refreshResponse = await agent
      .post('/auth/refresh')
      .send({ refreshToken: loginResponse.body.data.refreshToken })
      .expect(200);

    expect(refreshResponse.body.data.accessToken).toBeDefined();
  });

  it('rejects duplicate registration', async () => {
    const agent = getTestAgent();

    await agent.post('/auth/register').send({ email: 'duplicate@test.com', password: TEST_PASSWORD }).expect(201);

    await agent.post('/auth/register').send({ email: 'duplicate@test.com', password: TEST_PASSWORD }).expect(400);
  });
});
