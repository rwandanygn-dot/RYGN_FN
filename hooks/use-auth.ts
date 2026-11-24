'use client';

import { useMutation } from '@tanstack/react-query';
import { authApi, type LoginInput } from '@/lib/api/auth';
import type { ApiError } from '@/lib/api/client';
import { useAuthStore } from '@/store/auth-store';

/** Signs in and stores the session. Errors are ApiError (see error.code / error.fieldErrors). */
export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation<Awaited<ReturnType<typeof authApi.login>>, ApiError, LoginInput>({
    mutationKey: ['auth', 'login'],
    mutationFn: authApi.login,
    onSuccess: ({ user, accessToken }) => setSession(user, accessToken),
  });
}
