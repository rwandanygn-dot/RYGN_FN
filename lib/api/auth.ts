import { useAuthStore } from '@/store/auth-store';
import type { AuthUser } from '@/store/types';
import { apiRequest, refreshAccessToken } from './client';

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

  /** Emails a password reset link (the response is the same whether or not the email exists). */
  forgotPassword: async (email: string) =>
    (await apiRequest<null>('/auth/forgot-password', { method: 'POST', body: { email }, auth: false })).message,

  me: async () => (await apiRequest<{ user: AuthUser }>('/auth/me')).data.user,
};

/**
 * Rebuilds the in-memory session after a page load: exchanges the httpOnly refresh
 * cookie for an access token, then loads the user. Returns null when signed out.
 */
export async function restoreSession(): Promise<AuthUser | null> {
  const { accessToken, setUser, clearSession } = useAuthStore.getState();
  if (!accessToken && !(await refreshAccessToken())) return null;
  try {
    const user = await authApi.me();
    setUser(user);
    return user;
  } catch {
    clearSession();
    return null;
  }
}
