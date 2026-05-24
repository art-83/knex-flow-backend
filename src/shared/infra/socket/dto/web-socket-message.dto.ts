interface WebSocketMessageDTO {
  channelId: string;
  payload: Record<string, unknown>;
}

export default WebSocketMessageDTO;
