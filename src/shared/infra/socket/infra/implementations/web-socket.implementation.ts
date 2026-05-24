import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { container } from 'tsyringe';

import IJwtProvider from '../../../../../modules/users/infra/jwt/providers/jwt.provider';
import WebSocketMessageDTO from '../../dto/web-socket-message.dto';
import SocketServicesFactory from '../../factories/web-socket-adapter-services.factory';
import IWebSocketProvider from '../providers/web-socket.provider';

class WebSocketImplementation implements IWebSocketProvider {
  private server: Server;
  private connections: Map<string, Socket>;

  constructor() {
    this.connections = new Map();
  }

  public async initialize(server: HttpServer): Promise<void> {
    if (this.server) {
      return;
    }

    this.server = new Server(server, {
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
        const payloadWithUser: WebSocketMessageDTO = {
          ...payload,
          payload: {
            ...payload.payload,
            user_id: socket.data.user_id,
          },
        };
        const serviceAdapter = SocketServicesFactory.create(payloadWithUser);
        await serviceAdapter.execute(payloadWithUser);
      });

      socket.on('disconnect', () => {
        if (this.connections.get(channelId)?.id === socket.id) {
          this.connections.delete(channelId);
        }
      });
    });
  }

  public async sendMessage(payload: WebSocketMessageDTO): Promise<void> {
    const connection = this.connections.get(payload.channelId);
    if (connection) {
      connection.emit('message', payload.payload);
    }
  }

  public async closeConnection(channelId: string): Promise<void> {
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

export default WebSocketImplementation;
