import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ApiError } from './errors';

type AuthPayload = {
  sub: string;
  email: string;
};

function authJwtSecret(): string {
  const secret = process.env.AUTH_JWT_SECRET;

  if (!secret) {
    throw new ApiError(500, 'CONFIG_ERROR', 'AUTH_JWT_SECRET is not configured');
  }

  return secret;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Authorization token is required');
  }

  const token = authorizationHeader.replace('Bearer ', '').trim();

  try {
    const payload = jwt.verify(token, authJwtSecret()) as AuthPayload;
    req.userId = payload.sub;
    next();
  } catch {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid authorization token');
  }
}
