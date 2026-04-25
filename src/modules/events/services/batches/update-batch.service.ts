import { inject, injectable } from 'tsyringe';
import CreateOrUpdateBatchDTO from '../../dtos/batch/create-or-update-batch.dto';
import IBatchRepositoryProvider from '../../infra/orm/repositories/providers/batch-repository.provider';
import IEventRepositoryProvider from '../../infra/orm/repositories/providers/event-repository.provider';
import IUserOrganizationRepositoryProvider from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import UserOrganizationQueryOptions from '../../../users/dtos/user-organization/user-organization-query-options';
import AppError from '../../../../shared/infra/http/errors/app-error';

@injectable()
export class UpdateBatchService {
  constructor(
    @inject('BatchRepositoryProvider')
    private batchRepository: IBatchRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
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

    const userPermissionQueryOptions = {
      user_id,
      organization_id: event.organization.id,
    } as UserOrganizationQueryOptions;

    const userOrganization = (await this.userOrganizationRepository.find(userPermissionQueryOptions)).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'User does not have permission to update batch in this organization.',
        'Usuario nao tem permissao para atualizar lote nesta organizacao.',
      );
    }

    const batch = await this.batchRepository.update(batch_id, data);
    return { message: 'Batch updated successfully.', data: batch };
  }
}
