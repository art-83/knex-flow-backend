import { WebSocketType } from '../enums/web-socket-type';

interface WebSocketMessageDTO {
  channel_id: string;
  type: WebSocketType;
  payload: Record<string, unknown>;
}
export { WebSocketMessageDTO };
