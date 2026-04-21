import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/app-error';
import { isCelebrateError } from 'celebrate';

async function globalErrorHandlerMiddleware(error: Error, request: Request, response: Response, next: NextFunction) {
  if (isCelebrateError(error)) {
    return response.status(400).json({ message: error.message });
  }

  if (error instanceof AppError) {
    return response.status(error.code).json({ message: error.message });
  }

  console.error(error);
  return response.status(500).json({ message: 'Internal server error' });
}

export default globalErrorHandlerMiddleware;
