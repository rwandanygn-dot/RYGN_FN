'use client';

import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiError } from '@/lib/api/client';

interface ApiMutationOptions<V, R> {
  mutationFn: (vars: V) => Promise<R>;
  /** Toast shown on success; return nothing to skip it. */
  success?: (result: R, vars: V) => string | void;
  /** Extra work after success (update the store, close a dialog…). */
  onSuccess?: (result: R, vars: V) => void;
  /** Queries to refetch once the change settles. */
  invalidate?: QueryKey[];
}

/**
 * Standard dashboard mutation: success and error toasts, then refreshed queries.
 * Auth forms use plain useMutation instead, because they show errors inline.
 */
export function useApiMutation<V = void, R = unknown>({ mutationFn, success, onSuccess, invalidate = [] }: ApiMutationOptions<V, R>) {
  const queryClient = useQueryClient();
  return useMutation<R, ApiError, V>({
    mutationFn,
    onSuccess: (result, vars) => {
      const message = success?.(result, vars);
      if (message) toast.success(message);
      onSuccess?.(result, vars);
    },
    onError: (error) => toast.error(error.message),
    onSettled: () => Promise.all(invalidate.map((queryKey) => queryClient.invalidateQueries({ queryKey }))),
  });
}
