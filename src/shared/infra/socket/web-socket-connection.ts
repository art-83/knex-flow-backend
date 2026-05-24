import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { container } from 'tsyringe';

import IJwtProvider from '../../../modules/users/infra/jwt/providers/jwt.provider';
import SocketServicesFactory from './factories/web-socket-adapter-services.factory';
import WebSocketMessageDTO from './dto/web-socket-message.dto';

class WebSocketConnection {
  private static instance: WebSocketConnection;
  private server: Server;
  private connections: Map<string, Socket>;

  private constructor() {
    this.connections = new Map();
  }

  public static getInstance(): WebSocketConnection {
    if (!WebSocketConnection.instance) {
      WebSocketConnection.instance = new WebSocketConnection();
    }
    return WebSocketConnection.instance;
  }

  public static hasInstance(): boolean {
    return Boolean(WebSocketConnection.instance);
  }

  public initialize(httpServer: HttpServer): void {
    if (this.server) {
      return;
    }

    this.server = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.server.use((socket, next) => {
      try {
        const token = this.extractBearerToken(socket.handshake.auth.token);
        const jwtProvider = container.resolve<IJwtProvider>('JwtProvider');
        const payload = jwtProvider.verifyAccessToken(token);

        socket.data.user_id = payload.user_id;
        next();
      } catch (error) {
        next(new Error('Invalid token'));
      }
    });

    this.server.on('connection', socket => {
      const channelId = String(socket.handshake.query.channel_id);
      this.connections.set(channelId, socket);

      socket.on('message', async (payload: WebSocketMessageDTO) => {
        const serviceAdapter = SocketServicesFactory.create(payload);
        await serviceAdapter.execute(payload);
      });

      socket.on('disconnect', () => {
        if (this.connections.get(channelId)?.id === socket.id) {
          this.connections.delete(channelId);
        }
      });
    });
  }

  public sendMessage(payload: WebSocketMessageDTO): void {
    const connection = this.connections.get(payload.channelId);
    if (connection) {
      connection.emit('message', payload.payload);
    }
  }

  public closeConnection(channelId: string): void {
    const connection = this.connections.get(channelId);
    if (connection) {
      connection.disconnect(true);
    }
    this.connections.delete(channelId);
  }

  private extractBearerToken(value: unknown): string {
    if (typeof value !== 'string') {
      throw new Error('Missing token');
    }

    const [scheme, token] = value.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new Error('Invalid token');
    }

    return token;
  }
}

export default WebSocketConnection;
