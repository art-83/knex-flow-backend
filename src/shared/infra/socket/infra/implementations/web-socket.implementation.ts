import { Server as HttpServer } from 'http';

import RedisConnection from '../../../queue/redis-connection';
import WebSocketMessageDTO from '../../dto/web-socket-message.dto';
import WebSocketConnection from '../../web-socket-connection';
import IWebSocketProvider from '../providers/web-socket.provider';

class WebSocketImplementation implements IWebSocketProvider {
  private readonly channel = 'websocket:messages';
  private subscribed = false;

  public async initialize(server: HttpServer): Promise<void> {
    WebSocketConnection.getInstance().initialize(server);
    await this.subscribe();
  }

  public async sendMessage(payload: WebSocketMessageDTO): Promise<void> {
    if (WebSocketConnection.hasInstance()) {
      WebSocketConnection.getInstance().sendMessage(payload);
      return;
    }
    await this.publish(payload);
  }

  public async closeConnection(channelId: string): Promise<void> {
    if (WebSocketConnection.hasInstance()) {
      WebSocketConnection.getInstance().closeConnection(channelId);
    }
  }

  private async publish(payload: WebSocketMessageDTO): Promise<void> {
    await RedisConnection.getInstance().getConnection().publish(this.channel, JSON.stringify(payload));
  }

  private async subscribe(): Promise<void> {
    if (this.subscribed) {
      return;
    }

    const subscriber = RedisConnection.getInstance().getConnection().duplicate();

    subscriber.on('message', (_channel: string, message: string) => {
      const payload = JSON.parse(message) as WebSocketMessageDTO;
      WebSocketConnection.getInstance().sendMessage(payload);
    });

    await subscriber.subscribe(this.channel);
    this.subscribed = true;
  }
}

export default WebSocketImplementation;
