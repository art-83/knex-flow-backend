import { File } from '../../files/infra/orm/entities/file.entity';
import { FileQueryOptions } from '../../files/dtos/file/file-query-options';
import { IFileRepositoryProvider } from '../../files/infra/orm/repositories/providers/file-repository.provider';
import { EventActivityInvited } from '../infra/orm/entities/event-activity-invited.entity';

async function resolveInvitedFile(
  fileRepository: IFileRepositoryProvider,
  user_id: string,
  file_id: string | null | undefined,
): Promise<File | null | undefined> {
  if (file_id === undefined) {
    return undefined;
  }

  if (file_id === null) {
    return null;
  }

  const file = (await fileRepository.find({ id: file_id, user_id } as FileQueryOptions)).at(0);

  if (!file) {
    return null;
  }

  return file;
}

async function applyInvitedFileToPayload(
  fileRepository: IFileRepositoryProvider,
  user_id: string,
  file_id: string | null | undefined,
  payload: Partial<EventActivityInvited>,
): Promise<void> {
  const file = await resolveInvitedFile(fileRepository, user_id, file_id);

  if (file === undefined) {
    return;
  }

  payload.file = file;
}
export { applyInvitedFileToPayload, resolveInvitedFile };
