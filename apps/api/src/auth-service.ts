import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { ApiError } from './errors';
import { prisma } from './prisma';
import type { LoginInput, SignupInput } from '@vocabmaster/shared';

const PASSWORD_SALT_ROUNDS = 12;

function authJwtSecret(): string {
  const secret = process.env.AUTH_JWT_SECRET;

  if (!secret) {
    throw new ApiError(500, 'CONFIG_ERROR', 'AUTH_JWT_SECRET is not configured');
  }

  return secret;
}

export async function signup(input: SignupInput): Promise<{ token: string }> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email }
  });

  if (existingUser) {
    throw new ApiError(409, 'EMAIL_ALREADY_EXISTS', 'Email is already in use');
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash
    }
  });

  const token = jwt.sign({ sub: user.id, email: user.email }, authJwtSecret(), {
    expiresIn: '7d'
  });

  return { token };
}

export async function login(input: LoginInput): Promise<{ token: string }> {
  const user = await prisma.user.findUnique({
    where: { email: input.email }
  });

  if (!user) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const token = jwt.sign({ sub: user.id, email: user.email }, authJwtSecret(), {
    expiresIn: '7d'
  });

  return { token };
}
