import { randomUUID } from 'crypto';
import path from 'path';

function buildFilePath(originalName: string): string {
  const sanitizedFilename = path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${randomUUID()}_${sanitizedFilename}`;
}
export { buildFilePath };
