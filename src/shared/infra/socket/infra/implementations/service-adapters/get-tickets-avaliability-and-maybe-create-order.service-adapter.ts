import { inject, injectable } from 'tsyringe';

import bullmqConfig from '../../../../../../config/bullmq.config';
import RetrieveAvailableTicketsJobPayloadDTO from '../../../../../../modules/events/dtos/ticket/retrieve-available-tickets-job-payload.dto';
import { QueueNames } from '../../../../queue/enums/queues-names.enum';
import { IProducerProvider } from '../../../../queue/infra/providers/producer.provider';
import IWebSocketServiceAdapterProvider from '../../providers/web-socket-service-adapter.provider';
import WebSocketMessageDTO from '../../../dto/web-socket-message.dto';

@injectable()
class GetTicketsAvaliabilityAndMaybeCreateOrderServiceAdapter implements IWebSocketServiceAdapterProvider {
  constructor(
    @inject('ProducerProvider')
    private producerProvider: IProducerProvider,
  ) {}

  async execute(payload: WebSocketMessageDTO): Promise<void> {
    const body = payload.payload;
    const jobPayload = {
      channel_id: String(payload.channel_id),
      body: {
        user_id: String(body.user_id),
        event_id: String(body.event_id),
      },
    } as RetrieveAvailableTicketsJobPayloadDTO;

    await this.producerProvider.createJob(
      QueueNames.RETRIEVE_AVAILABLE_TICKETS,
      jobPayload,
      bullmqConfig.defaultJobOptions,
    );
  }
}

export default GetTicketsAvaliabilityAndMaybeCreateOrderServiceAdapter;
