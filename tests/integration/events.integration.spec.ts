import { describe, it, expect } from 'vitest';

import { getTestAgent } from '../helpers/test-app';
import { seedAdminWithOrganization } from '../helpers/auth-helper';
import { EventModality } from '../../src/modules/events/infra/orm/enums/event-modality.enum';

describe('Events integration', () => {
  it('creates, lists, publishes and exposes public availability', async () => {
    const agent = getTestAgent();
    const admin = await seedAdminWithOrganization();

    const startDate = new Date(Date.now() + 86_400_000).toISOString();
    const endDate = new Date(Date.now() + 172_800_000).toISOString();

    const createResponse = await agent
      .post('/events')
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .send({
        name: 'Integration Event',
        description: 'Event for integration tests',
        organization_id: admin.organizationId,
        start_date: startDate,
        end_date: endDate,
        modality: EventModality.ONLINE,
        url_path: 'integration-event',
      })
      .expect(201);

    const eventId = createResponse.body.event.id as string;

    await agent
      .post('/events/batches')
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .send({
        event_id: eventId,
        base_quantity: 10,
        price: 50,
      })
      .expect(201);

    await agent.post(`/events/${eventId}/publish`).set('Authorization', `Bearer ${admin.accessToken}`).expect(200);

    const listResponse = await agent
      .get('/events')
      .query({ organization_id: admin.organizationId })
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .expect(200);

    expect(listResponse.body.data.length).toBeGreaterThan(0);

    const publicResponse = await agent.get('/public/events').expect(200);

    expect(publicResponse.body.data.length).toBeGreaterThan(0);

    const availabilityResponse = await agent.get(`/public/events/${eventId}/availability`).expect(200);

    expect(availabilityResponse.body.data).toBeDefined();
  });
});
