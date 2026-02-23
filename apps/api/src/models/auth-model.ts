import { getPrismaClient } from './prisma';

export type AuthUser = {
  id: string;
  email: string;
  passwordHash: string;
};

export async function findUserByEmail(email: string): Promise<AuthUser | null> {
  const prisma = getPrismaClient();
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    passwordHash: user.passwordHash
  };
}

export async function createUser(email: string, passwordHash: string): Promise<{ id: string; email: string }> {
  const prisma = getPrismaClient();
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash
    }
  });

  return {
    id: user.id,
    email: user.email
  };
}
