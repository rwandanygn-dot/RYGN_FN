'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, restoreSession, type LoginInput, type LoginResponse } from '@/lib/api/auth';
import type { ApiError } from '@/lib/api/client';
import { useAuthStore } from '@/store/auth-store';

const SESSION_KEY = ['auth', 'session'] as const;

/** Signs in and stores the session. Errors are ApiError (see error.code / error.fieldErrors). */
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation<LoginResponse, ApiError, LoginInput>({
    mutationKey: ['auth', 'login'],
    mutationFn: authApi.login,
    onSuccess: ({ user, accessToken }) => setSession(user, accessToken),
  });
}

/**
 * Current user. The auth store is the source of truth; when it's empty (e.g. after a
 * reload) the session is restored once from the refresh cookie.
 */
export function useSession() {
  const user = useAuthStore((s) => s.user);
  const restore = useQuery({
    queryKey: SESSION_KEY,
    queryFn: restoreSession,
    enabled: !user,
    retry: false,
    staleTime: Infinity,
  });
  return { user, isLoading: !user && restore.isPending };
}

/** Signs out on the server (best effort) and clears the session; <RequireAuth> then redirects to /login. */
export function useLogout() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: authApi.logout,
    onSettled: () => {
      clearSession();
      queryClient.removeQueries({ queryKey: ['auth'] });
    },
  });
}
