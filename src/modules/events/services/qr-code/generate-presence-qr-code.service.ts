import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IQRCodeProvider } from '../../../../shared/infra/qr-code/providers/qr-code.provider';
import { PresenceQRPayloadDTO } from '../../../../shared/dtos/internal/qr-code/presence-qr-payload.dto';
import { IEventActivityPresenceRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-presence-repository.provider';
import { IEventActivityRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-repository.provider';
import { EventActivityPresenceQueryOptionsDTO } from '../../dtos/incoming/http/event-activity-presence/event-activity-presence-query-options.dto';
import { OrderStatus } from '../../infra/orm/enums/order-status.enum';

@injectable()
class GeneratePresenceQRCodeService {
  constructor(
    @inject('EventActivityPresenceRepositoryProvider')
    private eventActivityPresenceRepository: IEventActivityPresenceRepositoryProvider,
    @inject('EventActivityRepositoryProvider')
    private eventActivityRepository: IEventActivityRepositoryProvider,
    @inject('QRCodeProvider')
    private qrCodeProvider: IQRCodeProvider<PresenceQRPayloadDTO>,
  ) {}

  public async execute(user_id: string, event_activity_id: string) {
    const eventActivity = (await this.eventActivityRepository.find({ id: event_activity_id })).at(0);

    if (!eventActivity) {
      throw new AppError(404, 'Event activity not found.', 'Atividade de evento nao encontrada.');
    }

    const presenceQueryOptions: Partial<EventActivityPresenceQueryOptionsDTO> = {
      event_activity_id,
      user_id,
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

    if (existingPresence.order.status !== OrderStatus.CONFIRMED) {
      throw new AppError(
        400,
        'Order must be confirmed to generate presence QR code.',
        'Pedido deve estar confirmado para gerar QR code de presenca.',
      );
    }

    if (existingPresence.user_presence) {
      throw new AppError(
        409,
        'User already checked in for this event activity.',
        'Usuario ja registrou presenca nesta atividade do evento.',
      );
    }

    const payload: PresenceQRPayloadDTO = {
      event_activity_id,
      user_id,
    };

    const qrCode = await this.qrCodeProvider.generate(payload);

    return {
      message: 'Presence QR code generated successfully.',
      qr_code: qrCode,
    };
  }
}
export { GeneratePresenceQRCodeService };
