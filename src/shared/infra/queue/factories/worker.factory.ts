import { QueueNames } from '../enums/queues-names.enum';
import { RetrieveAvailableTicketsWorker } from '../../../../modules/events/infra/queue/retrieve-available-tickets.worker';
import { IWorkerProvider } from '../infra/providers/worker.provider';
import { WelcomeWorker } from '../../../../modules/users/infra/queue/welcome-worker';
import { DiscordErrorWebhookWorker } from '../../../../modules/observability/infra/queue/discord-error-webhook.worker';

class WorkerFactory {
  public static createWorker(queueName: QueueNames): IWorkerProvider {
    switch (queueName) {
      case QueueNames.RETRIEVE_AVAILABLE_TICKETS:
        return new RetrieveAvailableTicketsWorker();
      case QueueNames.SEND_WELCOME_EMAIL:
        return new WelcomeWorker();
      case QueueNames.DISCORD_ERROR_WEBHOOK:
        return new DiscordErrorWebhookWorker();
      default:
        throw new Error(`Worker ${queueName} not found`);
    }
  }
}
export { WorkerFactory };
