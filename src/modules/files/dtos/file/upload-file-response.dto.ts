interface UploadFileResponseDTO {
  id: string;
  path: string;
  mime_type: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  url: string;
}
export { UploadFileResponseDTO };
