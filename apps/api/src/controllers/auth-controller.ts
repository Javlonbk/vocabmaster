import type { LoginInput, SignupInput } from '@vocabmaster/shared';

import { login, signup } from '../services/auth-service';

type AuthHandler<T> = (input: T) => Promise<{ token: string }>;

export type AuthController = {
  signup: AuthHandler<SignupInput>;
  login: AuthHandler<LoginInput>;
};

export function createAuthController(controller: Partial<AuthController> = {}): AuthController {
  return {
    signup: controller.signup ?? signup,
    login: controller.login ?? login
  };
}
