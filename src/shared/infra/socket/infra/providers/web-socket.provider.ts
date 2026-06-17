import { Server as HttpServer } from 'http';
import { WebSocketMessageDTO } from '../../dto/web-socket-message.dto';

interface IWebSocketProvider {
  initialize(server: HttpServer): Promise<void>;
  sendMessage(payload: WebSocketMessageDTO): Promise<void>;
  closeConnection(channelId: string): Promise<void>;
}
export { IWebSocketProvider };
