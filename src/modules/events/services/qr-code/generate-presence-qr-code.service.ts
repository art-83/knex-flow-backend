import { inject, injectable } from 'tsyringe';
import { AppError } from '../../../../shared/infra/http/errors/app-error';
import { IQRCodeProvider } from '../../../../shared/infra/qr-code/providers/qr-code.provider';
import { PresenceQRPayloadDTO } from '../../../../shared/infra/qr-code/dtos/presence-qr-payload.dto';
import { IEventActivityPresenceRepositoryProvider } from '../../infra/orm/repositories/providers/event-activity-presence-repository.provider';

@injectable()
class GeneratePresenceQRCodeService {
  constructor(
    @inject('EventActivityPresenceRepositoryProvider')
    private eventActivityPresenceRepository: IEventActivityPresenceRepositoryProvider,
    @inject('QRCodeProvider')
    private qrCodeProvider: IQRCodeProvider<PresenceQRPayloadDTO>,
  ) {}

  public async execute(user_id: string, event_activity_id: string): Promise<string> {
    const presence = (
      await this.eventActivityPresenceRepository.find({
        event_activity_id,
        user_id,
        limit: 1,
      })
    ).at(0);

    if (!presence) {
      throw new AppError(404, 'Presence not found.', 'Presenca nao encontrada.');
    }

    if (!presence.order) {
      throw new AppError(
        404,
        'User is not registered for this event activity.',
        'Usuario nao esta inscrito nesta atividade do evento.',
      );
    }

    const payload: PresenceQRPayloadDTO = {
      presence_id: presence.id,
      event_activity_id,
      order_id: presence.order.id,
      user_id,
      user_presence: presence.user_presence,
    };

    return this.qrCodeProvider.generate(payload);
  }
}
export { GeneratePresenceQRCodeService };
