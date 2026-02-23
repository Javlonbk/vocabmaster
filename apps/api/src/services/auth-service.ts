import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import type { LoginInput, SignupInput } from '@vocabmaster/shared';
import { getAuthJwtSecret } from '../config/env';
import { createUser, findUserByEmail } from '../models/auth-model';
import { ApiError } from '../utils/errors';

const PASSWORD_SALT_ROUNDS = 12;

export async function signup(input: SignupInput): Promise<{ token: string }> {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    throw new ApiError(409, 'EMAIL_ALREADY_EXISTS', 'Email is already in use');
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
  const user = await createUser(input.email, passwordHash);
  const token = jwt.sign({ sub: user.id, email: user.email }, getAuthJwtSecret(), {
    expiresIn: '7d'
  });

  return { token };
}

export async function login(input: LoginInput): Promise<{ token: string }> {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, getAuthJwtSecret(), {
    expiresIn: '7d'
  });

  return { token };
}
