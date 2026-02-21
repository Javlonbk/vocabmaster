import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

import { ApiError } from './errors';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new ApiError(400, 'VALIDATION_ERROR', 'Invalid request payload', result.error.flatten());
    }

    req.body = result.data;
    next();
  };
}
