import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateEventService } from '../../../services/events/create-event.service';
import { CreateBatchService } from '../../../services/batches/create-batch-and-tickets.service';
import { CreateEventActivityService } from '../../../services/activities/create-event-activity.service';
import { FindEventsService } from '../../../services/public/find-events.service';
import { UpdateEventService } from '../../../services/events/update-event.service';
import { DeleteEventService } from '../../../services/events/delete-event.service';
import { FindBatchesService } from '../../../services/batches/find-batches.service';
import { UpdateBatchService } from '../../../services/batches/update-batch.service';
import { DeleteBatchService } from '../../../services/batches/delete-batch.service';
import { FindEventActivitiesService } from '../../../services/activities/find-event-activities.service';
import { UpdateEventActivityService } from '../../../services/activities/update-event-activity.service';
import { DeleteEventActivityService } from '../../../services/activities/delete-event-activity.service';
import { FindEventConfigurationsService } from '../../../services/event-configurations/find-event-configurations.service';
import { UpdateEventConfigurationService } from '../../../services/event-configurations/update-event-configuration.service';
import { DeleteEventConfigurationService } from '../../../services/event-configurations/delete-event-configuration.service';
import { CreateEventInvitedService } from '../../../services/activities/create-event-invited.service';

class EventController {
  public async findEvents(request: Request, response: Response) {
    const findEventsService = container.resolve(FindEventsService);
    const events = await findEventsService.execute(request.query);
    return response.json(events);
  }

  public async createEvent(request: Request, response: Response) {
    const createEventService = container.resolve(CreateEventService);
    const event = await createEventService.execute(request.user_id, request.body);
    return response.status(201).json(event);
  }

  public async updateEvent(request: Request, response: Response) {
    const updateEventService = container.resolve(UpdateEventService);
    const event_id = String(request.params.event_id);
    const event = await updateEventService.execute(request.user_id, event_id, request.body);
    return response.json(event);
  }

  public async deleteEvent(request: Request, response: Response) {
    const deleteEventService = container.resolve(DeleteEventService);
    const event_id = String(request.params.event_id);
    const event = await deleteEventService.execute(request.user_id, event_id);
    return response.json(event);
  }

  public async findBatches(request: Request, response: Response) {
    const findBatchesService = container.resolve(FindBatchesService);
    const batches = await findBatchesService.execute(request.user_id, request.query);
    return response.json(batches);
  }

  public async createBatch(request: Request, response: Response) {
    const createBatchService = container.resolve(CreateBatchService);
    const batch = await createBatchService.execute(request.user_id, request.body);
    return response.status(201).json(batch);
  }

  public async updateBatch(request: Request, response: Response) {
    const updateBatchService = container.resolve(UpdateBatchService);
    const batch_id = String(request.params.batch_id);
    const batch = await updateBatchService.execute(request.user_id, batch_id, request.body);
    return response.json(batch);
  }

  public async deleteBatch(request: Request, response: Response) {
    const deleteBatchService = container.resolve(DeleteBatchService);
    const batch_id = String(request.params.batch_id);
    const batch = await deleteBatchService.execute(request.user_id, batch_id);
    return response.json(batch);
  }

  public async findEventActivities(request: Request, response: Response) {
    const findEventActivitiesService = container.resolve(FindEventActivitiesService);
    const eventActivities = await findEventActivitiesService.execute(request.user_id, request.query);
    return response.json(eventActivities);
  }

  public async createEventActivity(request: Request, response: Response) {
    const createEventActivityService = container.resolve(CreateEventActivityService);
    const event_id = String(request.params.event_id);
    const eventActivity = await createEventActivityService.execute(request.user_id, event_id, request.body);
    return response.status(201).json(eventActivity);
  }

  public async updateEventActivity(request: Request, response: Response) {
    const updateEventActivityService = container.resolve(UpdateEventActivityService);
    const event_activity_id = String(request.params.event_activity_id);
    const eventActivity = await updateEventActivityService.execute(request.user_id, event_activity_id, request.body);
    return response.json(eventActivity);
  }

  public async deleteEventActivity(request: Request, response: Response) {
    const deleteEventActivityService = container.resolve(DeleteEventActivityService);
    const event_activity_id = String(request.params.event_activity_id);
    const eventActivity = await deleteEventActivityService.execute(request.user_id, event_activity_id);
    return response.json(eventActivity);
  }

  public async createEventInvited(request: Request, response: Response) {
    const createEventInvitedService = container.resolve(CreateEventInvitedService);
    const event_activity_id = String(request.params.event_activity_id);
    const invited = await createEventInvitedService.execute(request.user_id, event_activity_id, request.body);
    return response.status(201).json(invited);
  }

  public async findEventConfigurations(request: Request, response: Response) {
    const findEventConfigurationsService = container.resolve(FindEventConfigurationsService);
    const eventConfigurations = await findEventConfigurationsService.execute(request.user_id, request.query);
    return response.json(eventConfigurations);
  }

  public async updateEventConfiguration(request: Request, response: Response) {
    const updateEventConfigurationService = container.resolve(UpdateEventConfigurationService);
    const event_id = String(request.params.event_id);
    const eventConfiguration = await updateEventConfigurationService.execute(request.user_id, event_id, request.body);
    return response.json(eventConfiguration);
  }

  public async deleteEventConfiguration(request: Request, response: Response) {
    const deleteEventConfigurationService = container.resolve(DeleteEventConfigurationService);
    const event_id = String(request.params.event_id);
    const eventConfiguration = await deleteEventConfigurationService.execute(request.user_id, event_id);
    return response.json(eventConfiguration);
  }
}
export { EventController };
