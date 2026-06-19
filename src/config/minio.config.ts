const minioConfig = {
  endPoint: String(process.env.MINIO_ENDPOINT),
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: String(process.env.MINIO_ACCESS_KEY),
  secretKey: String(process.env.MINIO_SECRET_KEY),
  bucket: String(process.env.MINIO_BUCKET),
  publicUrl: String(process.env.MINIO_PUBLIC_URL),
};
export { minioConfig };
