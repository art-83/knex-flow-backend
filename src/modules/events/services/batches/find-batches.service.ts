import { inject, injectable } from 'tsyringe';
import { BatchQueryOptions } from '../../dtos/batch/batch-query-options';
import { IBatchRepositoryProvider } from '../../infra/orm/repositories/providers/batch-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { EnsureUserCanActOnOrganizationService } from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class FindBatchesService {
  constructor(
    @inject('BatchRepositoryProvider')
    private batchRepository: IBatchRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, options: Partial<BatchQueryOptions>) {
    if (!options.event_id) {
      throw new AppError(400, 'event_id is required.', 'event_id e obrigatorio.');
    }

    const event = (await this.eventRepository.find({ id: options.event_id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      event.organization.id,
      PermissionDescriptionEnum.BATCH_READ,
    );

    const batches = await this.batchRepository.find(options);
    return { message: 'Batches found successfully.', data: batches };
  }
}
export { FindBatchesService };
