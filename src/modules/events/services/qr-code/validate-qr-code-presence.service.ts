import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IQRCodeProvider } from '../../../../shared/infra/qr-code/providers/qr-code.provider';
import { PresenceQRPayloadDTO } from '../../../../shared/infra/qr-code/dtos/presence-qr-payload.dto';
import { IEventActivityPresenceRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-presence-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';

@injectable()
class ValidateQRCodePresenceService {
  constructor(
    @inject('EventActivityPresenceRepositoryProvider')
    private eventActivityPresenceRepository: IEventActivityPresenceRepositoryProvider,
    @inject('QRCodeProvider')
    private qrCodeProvider: IQRCodeProvider<PresenceQRPayloadDTO>,
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('EventRepositoryProvider')
    private eventRepository: IEventRepositoryProvider,
    @inject('UserOrganizationRepositoryProvider')
    private userOrganizationRepository: IUserOrganizationRepositoryProvider,
    @inject('PermissionRepositoryProvider')
    private permissionRepository: IPermissionRepositoryProvider,
    @inject('UserPermissionRepositoryProvider')
    private userPermissionRepository: IUserPermissionRepositoryProvider,
  ) {}

  public async execute(user_id: string, event_activity_id: string, qr_code: string) {
    await this.ensureStaffPermission(user_id, event_activity_id);

    const payload = await this.qrCodeProvider.decode(qr_code);

    if (payload.event_activity_id !== event_activity_id) {
      throw new AppError(
        400,
        'QR code does not belong to this event activity.',
        'QR code nao pertence a esta atividade do evento.',
      );
    }

    const presence = (
      await this.eventActivityPresenceRepository.find({
        id: payload.presence_id,
        event_activity_id,
      })
    ).at(0);

    if (!presence?.order) {
      throw new AppError(404, 'Presence not found.', 'Presenca nao encontrada.');
    }

    if (presence.order.id !== payload.order_id || presence.order.user.id !== payload.user_id) {
      throw new AppError(400, 'Invalid QR code payload.', 'Payload do QR code invalido.');
    }

    if (presence.user_presence) {
      throw new AppError(400, 'Presence already validated.', 'Presenca ja validada.');
    }

    await this.eventActivityPresenceRepository.update(presence.id, { user_presence: true });

    return {
      message: 'Presence validated successfully.',
      data: {
        presence_id: presence.id,
        event_activity_id,
        user_id: payload.user_id,
        user_presence: true,
      },
    };
  }

  private async ensureStaffPermission(user_id: string, event_activity_id: string) {
    const eventActivity = (await this.eventActivityRepository.find({ id: event_activity_id })).at(0);

    if (!eventActivity) {
      throw new AppError(404, 'Event activity not found.', 'Atividade de evento nao encontrada.');
    }

    const event = (await this.eventRepository.find({ id: eventActivity.event.id })).at(0);

    if (!event) {
      throw new AppError(404, 'Event not found.', 'Evento nao encontrado.');
    }

    const userOrganization = (
      await this.userOrganizationRepository.find({ user_id, organization_id: event.organization.id })
    ).at(0);

    if (!userOrganization) {
      throw new AppError(
        403,
        'You do not have access to this organization.',
        'Voce nao tem acesso a esta organizacao.',
      );
    }

    const requiredPermission = (
      await this.permissionRepository.find({ description: PermissionDescriptionEnum.EVENTS_MANAGE })
    ).at(0);

    if (!requiredPermission) {
      throw new AppError(404, 'Permission not found.', 'Permissao nao encontrada.');
    }

    const permissionGrant = (
      await this.userPermissionRepository.find({
        user_id,
        organization_id: event.organization.id,
        permission_id: requiredPermission.id,
      })
    ).at(0);

    if (!permissionGrant) {
      throw new AppError(
        403,
        'You do not have permission to perform this action.',
        'Voce nao tem permissao para realizar esta acao.',
      );
    }
  }
}
export { ValidateQRCodePresenceService };
