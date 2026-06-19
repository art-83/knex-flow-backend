interface OrganizationConfiguration {
  max_batch_base_quantity?: number;
  can_edit_event_after_publish?: boolean;
  can_create_batches_after_publish?: boolean;
  can_create_event_activities_after_publish?: boolean;
  can_update_event_activities_after_publish?: boolean;
  can_create_event_activity_invited_after_publish?: boolean;
  can_update_event_activity_invited_after_publish?: boolean;
  can_delete_event_activity_invited_after_publish?: boolean;
}
export { OrganizationConfiguration };
