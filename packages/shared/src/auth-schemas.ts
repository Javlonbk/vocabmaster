import { z } from 'zod';

const emailSchema = z.email().max(254);
const passwordSchema = z.string().min(8).max(72);

export const signupInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export const loginInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export type SignupInput = z.infer<typeof signupInputSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
