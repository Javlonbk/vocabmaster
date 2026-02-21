export type AuthMode = 'login' | 'signup';

export type AuthRequest = {
  email: string;
  password: string;
};

export type AuthSuccessResponse = {
  token: string;
};

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
