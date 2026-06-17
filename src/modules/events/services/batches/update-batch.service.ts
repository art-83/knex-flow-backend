import { inject, injectable } from 'tsyringe';
import CreateOrUpdateBatchDTO from '../../dtos/batch/create-or-update-batch.dto';
import IBatchRepositoryProvider from '../../infra/orm/repositories/providers/batch-repository.provider';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import AppError from '../../../../shared/infra/http/errors/app-error';
import EnsureUserCanActOnOrganizationService from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import PermissionDescriptionEnum from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
export class UpdateBatchService {
  constructor(
    @inject('BatchRepositoryProvider')
    private batchRepository: IBatchRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, batch_id: string, data: Partial<CreateOrUpdateBatchDTO>) {
    const batchExists = (await this.batchRepository.find({ id: batch_id })).at(0);

    if (!batchExists) {
      throw new AppError(404, 'Batch not found.', 'Lote nao encontrado.');
    }

    const event = (await this.eventRepository.find({ id: batchExists.event.id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      event.organization.id,
      PermissionDescriptionEnum.BATCH_UPDATE,
    );

    const batch = await this.batchRepository.update(batch_id, data);
    return { message: 'Batch updated successfully.', data: batch };
  }
}
