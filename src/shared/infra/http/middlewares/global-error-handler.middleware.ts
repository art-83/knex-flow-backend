import { NextFunction, Request, Response } from 'express';
import AppError from '../errors/app-error';

async function globalErrorHandlerMiddleware(error: Error, request: Request, response: Response, next: NextFunction) {
  if (error instanceof AppError) {
    return response.status(error.code).json({ message: error.message });
  }

  console.error('[globalErrorHandlerMiddleware]', error);

  return response.status(500).json({ message: 'Internal server error' });
}

export default globalErrorHandlerMiddleware;
