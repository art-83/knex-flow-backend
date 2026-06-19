interface RetrieveAvailableTicketsJobPayloadDTO {
  channel_id: string;
  body: {
    user_id: string;
    event_id: string;
    event_activity_ids: string[];
  };
}
export { RetrieveAvailableTicketsJobPayloadDTO };
