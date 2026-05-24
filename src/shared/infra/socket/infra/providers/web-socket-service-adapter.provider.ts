import WebSocketMessageDTO from '../../dto/web-socket-message.dto';

interface IWebSocketServiceAdapterProvider {
  execute(payload: WebSocketMessageDTO): Promise<void>;
}

export default IWebSocketServiceAdapterProvider;
