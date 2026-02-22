import type { NextFunction, Request, Response } from 'express';

import { ApiError, toApiErrorBody } from '../utils/errors';

export function notFoundHandler(_req: Request, res: Response, next: NextFunction): void {
  void next;
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found'
    }
  });
}

export function errorHandler(error: unknown, _req: Request, res: Response, next: NextFunction): void {
  void next;

  if (error instanceof ApiError) {
    res.status(error.status).json(toApiErrorBody(error));
    return;
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}
