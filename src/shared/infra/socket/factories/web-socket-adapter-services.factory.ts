import { QueueNames } from '../../queue/enums/queues-names.enum';
import WebSocketMessageDTO from '../dto/web-socket-message.dto';
import GetTicketsAvaliabilityAndMaybeCreateOrderServiceAdapter from '../infra/implementations/service-adapters/get-tickets-avaliability-and-maybe-create-order.service-adapter';
import IWebSocketServiceAdapterProvider from '../infra/providers/web-socket-service-adapter.provider';
import { container } from 'tsyringe';

class SocketServicesFactory {
  public static create(payload: WebSocketMessageDTO): IWebSocketServiceAdapterProvider {
    switch (payload.payload.type) {
      case QueueNames.RETRIEVE_AVAILABLE_TICKETS:
        return container.resolve(GetTicketsAvaliabilityAndMaybeCreateOrderServiceAdapter);
      default:
        throw new Error('Invalid payload type');
    }
  }
}

export default SocketServicesFactory;
