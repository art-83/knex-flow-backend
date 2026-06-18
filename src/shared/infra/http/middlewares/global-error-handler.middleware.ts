import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { isCelebrateError } from 'celebrate';

import { bullmqConfig } from '../../../../config/bullmq.config';
import { DiscordErrorWebhookJobPayloadDTO } from '../../../../modules/observability/dtos/discord-error-webhook/discord-error-webhook-job-payload.dto';
import { QueueNames } from '../../queue/enums/queues-names.enum';
import { IProducerProvider } from '../../queue/infra/providers/producer.provider';
import { AppError } from '../errors/app-error';

async function globalErrorHandlerMiddleware(error: Error, request: Request, response: Response, next: NextFunction) {
  if (isCelebrateError(error)) {
    return response.status(400).json({ message: error.message });
  }

  if (error instanceof AppError) {
    return response.status(error.code).json({ message: error.message, formattedMessage: error.formattedMessage });
  }

  console.error('[globalErrorHandlerMiddleware]', error);

  const producerProvider = container.resolve<IProducerProvider>('ProducerProvider');

  await producerProvider.createJob(
    QueueNames.DISCORD_ERROR_WEBHOOK,
    {
      message: error.message,
      stack: error.stack ?? '',
    } as DiscordErrorWebhookJobPayloadDTO,
    bullmqConfig.defaultJobOptions,
  );

  return response.status(500).json({ message: 'Internal server error' });
}
export { globalErrorHandlerMiddleware };
