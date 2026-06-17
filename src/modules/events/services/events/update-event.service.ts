import { inject, injectable } from 'tsyringe';
import { CreateOrUpdateEventDTO } from '../../dtos/event/create-or-update-event.dto';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { EnsureUserCanActOnOrganizationService } from '../../../../shared/infra/http/authorization/ensure-user-can-act-on-organization.service';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class UpdateEventService {
  constructor(
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    private ensureUserCanActOnOrganizationService: EnsureUserCanActOnOrganizationService,
  ) {}

  public async execute(user_id: string, event_id: string, data: Partial<CreateOrUpdateEventDTO>) {
    const eventExists = (await this.eventRepository.find({ id: event_id })).at(0);

    if (!eventExists) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    await this.ensureUserCanActOnOrganizationService.execute(
      user_id,
      eventExists.organization.id,
      PermissionDescriptionEnum.EVENT_UPDATE,
    );

    const event = await this.eventRepository.update(event_id, data);
    return { message: 'Event updated successfully.', data: event };
  }
}
export { UpdateEventService };
