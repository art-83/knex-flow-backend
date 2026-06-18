import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { AppError } from '../../../../../shared/infra/http/errors/app-error';
import { EventModality } from '../../orm/enums/event-modality.enum';
import { IEventRepositoryProvider } from '../../orm/repositories/providers/event-repository.provider';
import { eventAddressSchema } from '../dtos/event-address-schema.dto';

async function validateOfflineEventAddressForPublishMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  try {
    const event_id = String(request.params.event_id);
    const eventRepository = container.resolve<IEventRepositoryProvider>('EventRepositoryProvider');
    const event = (await eventRepository.find({ id: event_id })).at(0);

    if (!event || event.modality !== EventModality.OFFLINE) {
      return next();
    }

    const { error } = eventAddressSchema.validate(event.address, { abortEarly: false });

    if (error) {
      throw new AppError(
        400,
        'Offline events require a complete address before publishing.',
        'Eventos presenciais precisam de um endereco completo antes de publicar.',
      );
    }

    return next();
  } catch (error) {
    return next(error);
  }
}
export { validateOfflineEventAddressForPublishMiddleware };
