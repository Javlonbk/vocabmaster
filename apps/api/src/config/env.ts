import { ApiError } from '../utils/errors';

export function getAuthJwtSecret(): string {
  const secret = process.env.AUTH_JWT_SECRET;

  if (!secret) {
    throw new ApiError(500, 'CONFIG_ERROR', 'AUTH_JWT_SECRET is not configured');
  }

  return secret;
}
