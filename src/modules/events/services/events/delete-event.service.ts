import { inject, injectable } from 'tsyringe';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { EnsureUserCanActOnOrganizationService } from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class DeleteEventService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, event_id: string) {
    const event = (await this.eventRepository.find({ id: event_id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      event.organization.id,
      PermissionDescriptionEnum.EVENT_DELETE,
    );

    const rowsDeleted = await this.eventRepository.delete(event_id);
    return { message: 'Event deleted successfully.', deleted: rowsDeleted };
  }
}
export { DeleteEventService };
