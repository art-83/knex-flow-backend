import { getTestAgent } from './test-app';
import { EventModality } from '../../src/modules/events/infra/orm/enums/event-modality.enum';

async function createPublishedEvent(
  accessToken: string,
  organizationId: string,
  slug: string,
  options?: { ticketPrice?: number; ticketQuantity?: number },
): Promise<string> {
  const agent = getTestAgent();
  const startDate = new Date(Date.now() + 86_400_000).toISOString();
  const endDate = new Date(Date.now() + 172_800_000).toISOString();

  const createResponse = await agent
    .post('/events')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name: 'Test Event',
      description: 'Event for automated tests',
      organization_id: organizationId,
      start_date: startDate,
      end_date: endDate,
      modality: EventModality.ONLINE,
      url_path: slug,
    })
    .expect(201);

  const eventId = createResponse.body.event.id as string;

  await agent
    .post('/events/batches')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      event_id: eventId,
      base_quantity: options?.ticketQuantity ?? 5,
      price: options?.ticketPrice ?? 75,
    })
    .expect(201);

  await agent.post(`/events/${eventId}/publish`).set('Authorization', `Bearer ${accessToken}`).expect(200);

  return eventId;
}

export { createPublishedEvent };
