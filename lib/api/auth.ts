import { useAuthStore } from '@/store/auth-store';
import type { AuthUser, CurrentUser } from '@/store/types';
import { apiRequest, refreshAccessToken } from './client';

// Request bodies — each mirrors a rygn_be validator (src/validators/auth.validator.ts).
export interface LoginInput {
  email: string;
  password: string;
}
export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  /** Only required once an administrator already exists. */
  signupCode?: string;
}
export interface ResetPasswordInput {
  token: string;
  password: string;
}
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
export interface UpdateProfileInput {
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  /** Access token lifetime in seconds. */
  expiresIn: number;
}

/** A signed-in device (GET /auth/sessions). */
export interface Session {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  lastUsedAt: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

const post = <T>(path: string, body?: unknown, auth = false) => apiRequest<T>(path, { method: 'POST', body, auth });

/** Typed calls to rygn_be /auth endpoints. Public ones send `auth: false`. */
export const authApi = {
  // Public
  login: async (input: LoginInput) => (await post<LoginResponse>('/auth/login', input)).data,
  register: async (input: RegisterInput) => (await post<{ user: AuthUser }>('/auth/register', input)).message,
  verifyEmail: async (token: string) => (await post<{ user: AuthUser }>('/auth/verify-email', { token })).message,
  /** Same answer whether or not the account exists (no account enumeration). */
  resendVerification: async (email: string) => (await post<null>('/auth/resend-verification', { email })).message,
  forgotPassword: async (email: string) => (await post<null>('/auth/forgot-password', { email })).message,
  resetPassword: async (input: ResetPasswordInput) => (await post<null>('/auth/reset-password', input)).message,
  logout: async () => {
    await post<null>('/auth/logout');
  },

  // Signed in
  me: async () => (await apiRequest<{ user: CurrentUser }>('/auth/me')).data.user,
  updateProfile: async (input: UpdateProfileInput) =>
    (await apiRequest<{ user: AuthUser }>('/auth/me', { method: 'PATCH', body: input })).data.user,
  /** Signs out every other device; returns a fresh access token for this one. */
  changePassword: async (input: ChangePasswordInput) =>
    (await post<{ accessToken: string; expiresIn: number }>('/auth/change-password', input, true)).data,
  sessions: async () => (await apiRequest<{ sessions: Session[] }>('/auth/sessions')).data.sessions,
  revokeSession: async (id: string) => {
    await apiRequest<null>(`/auth/sessions/${id}`, { method: 'DELETE' });
  },
  logoutAll: async () => {
    await post<null>('/auth/logout-all', undefined, true);
  },
};

/**
 * Rebuilds the in-memory session after a page load: exchanges the httpOnly refresh
 * cookie for an access token, then loads the user. Returns null when signed out.
 */
export async function restoreSession(): Promise<CurrentUser | null> {
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
