import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IQRCodeProvider } from '../../../../shared/infra/qr-code/providers/qr-code.provider';
import { PresenceQRPayloadDTO } from '../../../../shared/dtos/internal/qr-code/presence-qr-payload.dto';
import { IEventActivityPresenceRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-presence-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { IEventRepositoryProvider } from '../../infra/orm/repositories/providers/event-repository.provider';
import { IUserOrganizationRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-organization-repository.provider';
import { IPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/permission-repository.provider';
import { IUserPermissionRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-permission-repository.provider';
import { PermissionDescriptionEnum } from '../../../users/infra/orm/enums/permission-description.enum';
import { IUserRepositoryProvider } from '../../../users/infra/orm/repositories/providers/user-repository.provider';
import { EventActivityPresenceQueryOptionsDTO } from '../../dtos/incoming/http/event-activity-presence/event-activity-presence-query-options.dto';
import { MarkPresenceCheckInOutcomeStatus } from '../../infra/orm/enums/mark-presence-check-in-outcome-status.enum';

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
    @inject('UserRepositoryProvider')
    private userRepository: IUserRepositoryProvider,
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

    const eventActivity = (await this.eventActivityRepository.find({ id: event_activity_id })).at(0);

    if (!eventActivity) {
      throw new AppError(404, 'Event activity not found.', 'Atividade de evento nao encontrada.');
    }

    const user = (await this.userRepository.find({ id: payload.user_id })).at(0);

    if (!user) {
      throw new AppError(404, 'User not found.', 'Usuario nao encontrado.');
    }

    const presenceQueryOptions: Partial<EventActivityPresenceQueryOptionsDTO> = {
      event_activity_id,
      user_id: payload.user_id,
      limit: 1,
    };

    const existingPresence = (await this.eventActivityPresenceRepository.find(presenceQueryOptions)).at(0);

    if (!existingPresence) {
      throw new AppError(
        404,
        'User is not registered for this event activity.',
        'Usuario nao esta inscrito nesta atividade do evento.',
      );
    }

    const outcome = await this.eventActivityPresenceRepository.markPresenceCheckIn({
      presence_id: existingPresence.id,
      event_activity_id,
      user_id: payload.user_id,
    });

    switch (outcome.status) {
      case MarkPresenceCheckInOutcomeStatus.SUCCESS:
        if (!outcome.presence) {
          throw new AppError(
            500,
            'Presence check-in succeeded without presence data.',
            'Presenca registrada sem dados de retorno.',
          );
        }

        return {
          message: 'Presence validated successfully.',
          data: {
            presence_id: outcome.presence.id,
            event_activity_id,
            user_id: payload.user_id,
          },
        };
      case MarkPresenceCheckInOutcomeStatus.NOT_FOUND:
        throw new AppError(
          404,
          'User is not registered for this event activity.',
          'Usuario nao esta inscrito nesta atividade do evento.',
        );
      case MarkPresenceCheckInOutcomeStatus.MISMATCH:
        throw new AppError(
          400,
          'QR code does not belong to this event activity.',
          'QR code nao pertence a esta atividade do evento.',
        );
      case MarkPresenceCheckInOutcomeStatus.ORDER_NOT_CONFIRMED:
        throw new AppError(
          400,
          'Order must be confirmed to validate presence.',
          'Pedido deve estar confirmado para validar presenca.',
        );
      case MarkPresenceCheckInOutcomeStatus.ALREADY_CHECKED_IN:
        throw new AppError(
          409,
          'User already checked in for this event activity.',
          'Usuario ja registrou presenca nesta atividade do evento.',
        );
    }
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
