import { inject, injectable } from 'tsyringe';
import IBatchRepositoryProvider from '../../infra/orm/repositories/providers/batch-repository.provider';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import EnsureUserCanActOnOrganizationService from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import PermissionDescriptionEnum from '../../../users/enums/permission-description.enum';

@injectable()
export class DeleteBatchService {
  constructor(
    @inject('BatchRepositoryProvider')
    private batchRepository: IBatchRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, batch_id: string) {
    const batch = (await this.batchRepository.find({ id: batch_id })).at(0);

    if (!batch) {
      throw new AppError(404, 'Batch not found.', 'Lote nao encontrado.');
    }

    const event = (await this.eventRepository.find({ id: batch.event.id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      event.organization.id,
      PermissionDescriptionEnum.BATCH_DELETE,
    );

    const rowsDeleted = await this.batchRepository.delete(batch_id);
    return { message: 'Batch deleted successfully.', deleted: rowsDeleted };
  }
}
