'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth';
import type { ApiError } from '@/lib/api/client';
import { invitationsApi, type CreateInvitationInput } from '@/lib/api/invitations';
import { usersApi, type ListUsersParams, type ManageableStatus, type UserList } from '@/lib/api/users';
import { ROLE_LABELS, USER_STATUSES } from '@/lib/users';
import type { UserRole, UserStatus } from '@/store/types';
import { useApiMutation } from './use-api-mutation';
import { useCan } from './use-auth';

export const userKeys = {
  all: ['users'] as const,
  list: (params: ListUsersParams) => ['users', 'list', params] as const,
  counts: ['users', 'counts'] as const,
};

/** One page of users; keeps the previous page on screen while the next one loads. Needs user:read. */
export function useUsers(params: ListUsersParams) {
  return useQuery<UserList, ApiError>({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.list(params),
    placeholderData: keepPreviousData,
    enabled: useCan('user:read'),
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
    enabled: useCan('user:read'),
  });
}

/** Every change below refreshes all users queries (list, counts). */
const invalidate = [userKeys.all];

export const useUpdateUserRole = () =>
  useApiMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => usersApi.updateRole(id, role),
    success: (_, { role }) => `Role changed to ${ROLE_LABELS[role]}`,
    invalidate,
  });

/** Sets the status of one or more users; one failure (self, last admin…) doesn't stop the rest. */
export function useUpdateUserStatus() {
  return useApiMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: ManageableStatus }) => {
      const results = await Promise.allSettled(ids.map((id) => usersApi.updateStatus(id, status)));
      const errors = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
      return { succeeded: results.length - errors.length, failed: errors.length, error: (errors[0]?.reason as Error)?.message };
    },
    onSuccess: ({ succeeded, failed, error }, { status }) => {
      const verb = status === 'ACTIVE' ? 'reactivated' : 'suspended';
      if (succeeded) toast.success(`${succeeded} user${succeeded > 1 ? 's' : ''} ${verb}`);
      if (failed) toast.error(`${failed} not updated: ${error}`);
    },
    invalidate,
  });
}

/** Emails the user a password reset link (same flow as "Forgot password?"). */
export const useSendPasswordReset = () =>
  useApiMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    success: (_, email) => `Password reset link sent to ${email}`,
  });

export const useRevokeUserSessions = () =>
  useApiMutation({
    mutationFn: (id: string) => usersApi.revokeSessions(id),
    success: () => 'Signed out of all devices',
  });

export const useDeleteUser = () =>
  useApiMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    success: () => 'User deleted',
    invalidate,
  });

export const useInviteUser = () =>
  useApiMutation({
    mutationFn: (input: CreateInvitationInput) => invitationsApi.create(input),
    success: ({ emailSent }, { email }) =>
      emailSent ? `Invitation sent to ${email}` : `Invitation created, but the email to ${email} could not be sent`,
  });
