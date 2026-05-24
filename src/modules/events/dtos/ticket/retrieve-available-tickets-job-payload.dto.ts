interface RetrieveAvailableTicketsJobPayloadDTO {
  channel_id: string;
  body: {
    user_id: string;
    event_id: string;
  };
}

export default RetrieveAvailableTicketsJobPayloadDTO;
