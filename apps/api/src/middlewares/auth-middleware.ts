import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { getAuthJwtSecret } from '../config/env';
import { ApiError } from '../utils/errors';

type AuthPayload = {
  sub: string;
  email: string;
};

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Authorization token is required');
  }

  const token = authorizationHeader.replace('Bearer ', '').trim();

  try {
    const payload = jwt.verify(token, getAuthJwtSecret()) as AuthPayload;
    req.userId = payload.sub;
    next();
  } catch {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid authorization token');
  }
}
