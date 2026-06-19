interface EventConfigurationFlags {
  can_edit_event_after_publish: boolean;
  can_create_batches_after_publish: boolean;
  can_create_event_activities_after_publish: boolean;
  can_update_event_activities_after_publish: boolean;
  can_create_event_activity_invited_after_publish: boolean;
  can_update_event_activity_invited_after_publish: boolean;
  can_delete_event_activity_invited_after_publish: boolean;
}

interface EventConfigurationDTO {
  event: EventConfigurationFlags;
}

const DEFAULT_EVENT_CONFIGURATION: EventConfigurationDTO = {
  event: {
    can_edit_event_after_publish: true,
    can_create_batches_after_publish: true,
    can_create_event_activities_after_publish: false,
    can_update_event_activities_after_publish: false,
    can_create_event_activity_invited_after_publish: true,
    can_update_event_activity_invited_after_publish: true,
    can_delete_event_activity_invited_after_publish: true,
  },
};
export { DEFAULT_EVENT_CONFIGURATION, EventConfigurationDTO, EventConfigurationFlags };
