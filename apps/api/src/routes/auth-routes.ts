import { Router } from 'express';

import { loginInputSchema, signupInputSchema, type LoginInput, type SignupInput } from '@vocabmaster/shared';
import { createAuthController, type AuthController } from '../controllers/auth-controller';
import { validateBody } from '../middlewares/validation';

type AuthHandler<T> = (input: T) => Promise<{ token: string }>;

type AuthRouteDeps = {
  signupHandler: AuthHandler<SignupInput>;
  loginHandler: AuthHandler<LoginInput>;
};

export function createAuthRouter(deps: AuthRouteDeps): Router {
  const authRouter = Router();

  authRouter.post('/signup', validateBody(signupInputSchema), async (req, res) => {
    const authResult = await deps.signupHandler(req.body);
    res.status(201).json(authResult);
  });

  authRouter.post('/login', validateBody(loginInputSchema), async (req, res) => {
    const authResult = await deps.loginHandler(req.body);
    res.status(200).json(authResult);
  });

  return authRouter;
}

function toRouteDeps(controller: AuthController): AuthRouteDeps {
  return {
    signupHandler: controller.signup,
    loginHandler: controller.login
  };
}

export const authRouter = createAuthRouter(toRouteDeps(createAuthController()));
