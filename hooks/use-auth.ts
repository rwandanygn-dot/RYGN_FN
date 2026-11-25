'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  authApi,
  restoreSession,
  type ChangePasswordInput,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
  type UpdateProfileInput,
} from '@/lib/api/auth';
import type { ApiError } from '@/lib/api/client';
import { invitationsApi, type AcceptInvitationInput } from '@/lib/api/invitations';
import { useAuthStore } from '@/store/auth-store';
import type { CurrentUser, Permission } from '@/store/types';
import { useApiMutation } from './use-api-mutation';

export const authKeys = {
  all: ['auth'] as const,
  session: ['auth', 'session'] as const,
  sessions: ['auth', 'sessions'] as const,
  verifyEmail: (token: string) => ['auth', 'verify-email', token] as const,
  invitation: (token: string) => ['auth', 'invitation', token] as const,
};

// ─── Session ────────────────────────────────────────────────

/**
 * Current user. The auth store is the source of truth; when it's empty (e.g. after a
 * reload) the session is restored once from the refresh cookie.
 */
export function useSession() {
  const user = useAuthStore((s) => s.user);
  const restore = useQuery({
    queryKey: authKeys.session,
    queryFn: restoreSession,
    enabled: !user,
    retry: false,
    staleTime: Infinity,
  });
  return { user, isLoading: !user && restore.isPending };
}

/** True when the signed-in user's role grants `permission` (from GET /auth/me). */
export function useCan(permission: Permission) {
  return useAuthStore((s) => s.user?.permissions.includes(permission) ?? false);
}

/** Signs in, then loads the user's permissions. Errors are ApiError (error.code / error.fieldErrors). */
export function useLogin() {
  return useMutation<CurrentUser, ApiError, LoginInput>({
    mutationFn: async (input) => {
      const { setAccessToken, setSession } = useAuthStore.getState();
      const { user, accessToken } = await authApi.login(input);
      setAccessToken(accessToken); // lets /auth/me authenticate
      const current = (await authApi.me().catch(() => null)) ?? { ...user, permissions: [] };
      setSession(current, accessToken); // user set last: <GuestOnly> redirects as soon as it appears
      return current;
    },
  });
}

/** Signs out on the server (best effort) and clears the session; <RequireAuth> then redirects to /login. */
export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      useAuthStore.getState().clearSession();
      queryClient.clear();
    },
  });
}

// ─── Public auth flows (errors shown inline by the page) ────

export const useRegister = () => useMutation<string, ApiError, RegisterInput>({ mutationFn: authApi.register });
export const useResendVerification = () => useMutation<string, ApiError, string>({ mutationFn: authApi.resendVerification });
export const useForgotPassword = () => useMutation<string, ApiError, string>({ mutationFn: authApi.forgotPassword });
export const useResetPassword = () => useMutation<string, ApiError, ResetPasswordInput>({ mutationFn: authApi.resetPassword });
export const useAcceptInvitation = () =>
  useMutation<string, ApiError, AcceptInvitationInput>({ mutationFn: invitationsApi.accept });

/** Verification links are single-use: a query (not an effect) so the POST runs exactly once per token. */
export const useVerifyEmail = (token: string | null) =>
  useQuery<string, ApiError>({
    queryKey: authKeys.verifyEmail(token ?? ''),
    queryFn: () => authApi.verifyEmail(token!),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

export const useInvitation = (token: string | null) =>
  useQuery({
    queryKey: authKeys.invitation(token ?? ''),
    queryFn: () => invitationsApi.verify(token!),
    enabled: !!token,
    retry: false,
  });

// ─── My account (dashboard) ─────────────────────────────────

export function useUpdateProfile() {
  return useApiMutation({
    mutationFn: (input: UpdateProfileInput) => authApi.updateProfile(input),
    success: () => 'Profile updated',
    onSuccess: (updated) => {
      const { user, setUser } = useAuthStore.getState();
      if (user) setUser({ ...user, ...updated });
    },
    invalidate: [['users']],
  });
}

export function useChangePassword() {
  return useApiMutation({
    mutationFn: (input: ChangePasswordInput) => authApi.changePassword(input),
    success: () => 'Password changed. Your other devices have been signed out.',
    // The old access token is invalid now; keep this device signed in with the new one.
    onSuccess: ({ accessToken }) => useAuthStore.getState().setAccessToken(accessToken),
    invalidate: [authKeys.sessions],
  });
}

export const useSessions = () => useQuery({ queryKey: authKeys.sessions, queryFn: authApi.sessions });

export function useRevokeSession() {
  return useApiMutation({
    mutationFn: (id: string) => authApi.revokeSession(id),
    success: () => 'Device signed out',
    invalidate: [authKeys.sessions],
  });
}

/** Signs out every device, including this one. */
export function useLogoutAll() {
  const queryClient = useQueryClient();
  return useApiMutation({
    mutationFn: () => authApi.logoutAll(),
    success: () => 'Signed out on all devices',
    onSuccess: () => {
      useAuthStore.getState().clearSession();
      queryClient.clear();
    },
  });
}
