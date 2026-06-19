import { Agent } from 'supertest';

async function getAuthenticatedUserId(agent: Agent, accessToken: string): Promise<string> {
  const meResponse = await agent.get('/users/me').set('Authorization', `Bearer ${accessToken}`).expect(200);

  return meResponse.body.data.user[0].id as string;
}

export { getAuthenticatedUserId };
