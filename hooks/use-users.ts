'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';
import type { ApiError } from '@/lib/api/client';
import { usersApi, type ListUsersParams, type ManageableStatus, type UserList } from '@/lib/api/users';
import { ROLE_LABELS, USER_STATUSES } from '@/lib/users';
import type { UserRole, UserStatus } from '@/store/types';

export const userKeys = {
  all: ['users'] as const,
  list: (params: ListUsersParams) => ['users', 'list', params] as const,
  counts: ['users', 'counts'] as const,
};

/** One page of users; keeps the previous page on screen while the next one loads. */
export function useUsers(params: ListUsersParams) {
  return useQuery<UserList, ApiError>({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export type UserCounts = Record<'ALL' | UserStatus, number>;

/** Totals per status (tabs, sidebar badge, overview stats), read from each list's pagination total. */
export function useUserCounts() {
  return useQuery<UserCounts, ApiError>({
    queryKey: userKeys.counts,
    queryFn: async () => {
      const statuses = [undefined, ...USER_STATUSES];
      const lists = await Promise.all(statuses.map((status) => usersApi.list({ page: 1, limit: 1, status })));
      return Object.fromEntries(statuses.map((s, i) => [s ?? 'ALL', lists[i].meta.total])) as UserCounts;
    },
    retry: false,
  });
}

/** Runs a change, shows a toast, then refreshes every users query (list, counts). */
function useUsersMutation<V, R>(mutationFn: (vars: V) => Promise<R>, onSuccess: (result: R, vars: V) => void) {
  const queryClient = useQueryClient();
  return useMutation<R, ApiError, V>({
    mutationFn,
    onSuccess,
    onError: (error) => toast.error(error.message),
    onSettled: () => queryClient.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export const useUpdateUserRole = () =>
  useUsersMutation(
    ({ id, role }: { id: string; role: UserRole }) => usersApi.updateRole(id, role),
    (_, { role }) => toast.success(`Role changed to ${ROLE_LABELS[role]}`),
  );

/** Sets the status of one or more users; one failure (self, last admin…) doesn't stop the rest. */
export const useUpdateUserStatus = () =>
  useUsersMutation(
    async ({ ids, status }: { ids: string[]; status: ManageableStatus }) => {
      const results = await Promise.allSettled(ids.map((id) => usersApi.updateStatus(id, status)));
      const errors = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
      return { succeeded: results.length - errors.length, failed: errors.length, error: (errors[0]?.reason as Error)?.message };
    },
    ({ succeeded, failed, error }, { status }) => {
      const verb = status === 'ACTIVE' ? 'reactivated' : 'suspended';
      if (succeeded) toast.success(`${succeeded} user${succeeded > 1 ? 's' : ''} ${verb}`);
      if (failed) toast.error(`${failed} not updated: ${error}`);
    },
  );

/** Emails the user a password reset link (same flow as "Forgot password?"). */
export const useSendPasswordReset = () =>
  useMutation<string, ApiError, string>({
    mutationFn: authApi.forgotPassword,
    onSuccess: (_, email) => toast.success(`Password reset link sent to ${email}`),
    onError: (error) => toast.error(error.message),
  });
