import type { AuthUser } from '@/store/types';
import { apiRequest } from './client';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  /** Access token lifetime in seconds. */
  expiresIn: number;
}

/** Typed calls to rygn_be /auth endpoints. */
export const authApi = {
  login: async (input: LoginInput) =>
    (await apiRequest<LoginResponse>('/auth/login', { method: 'POST', body: input, auth: false })).data,

  logout: async () => {
    await apiRequest<null>('/auth/logout', { method: 'POST', auth: false });
  },

  me: async () => (await apiRequest<{ user: AuthUser }>('/auth/me')).data.user,
};
