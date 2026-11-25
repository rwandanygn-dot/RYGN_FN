import type { AuthUser, UserRole, UserStatus } from '@/store/types';
import { apiRequest, withQuery, type PaginationMeta } from './client';

/** A user as returned by rygn_be (publicUserSelect). */
export type User = AuthUser;

/** Statuses an admin can set; PENDING is only set by the system until the email is verified. */
export type ManageableStatus = Exclude<UserStatus, 'PENDING'>;

/** GET /users query — mirrors rygn_be listUsersQuery (limit ≤ 100, search ≤ 100 chars). */
export interface ListUsersParams {
  page: number;
  limit: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

export interface UserList {
  items: User[];
  meta: PaginationMeta;
}

const SEARCH_MAX = 100;

/** Typed calls to rygn_be /users endpoints. Each sends exactly the fields the backend validates. */
export const usersApi = {
  list: async ({ search, ...params }: ListUsersParams): Promise<UserList> => {
    const path = withQuery('/users', { ...params, search: search?.trim().slice(0, SEARCH_MAX) });
    const res = await apiRequest<User[]>(path);
    return { items: res.data, meta: res.meta! };
  },

  updateRole: async (id: string, role: UserRole) =>
    (await apiRequest<{ user: User }>(`/users/${id}/role`, { method: 'PATCH', body: { role } })).data.user,

  updateStatus: async (id: string, status: ManageableStatus) =>
    (await apiRequest<{ user: User }>(`/users/${id}/status`, { method: 'PATCH', body: { status } })).data.user,

  /** Signs the user out of every device. */
  revokeSessions: async (id: string) => {
    await apiRequest<null>(`/users/${id}/revoke-sessions`, { method: 'POST' });
  },

  /** Soft delete (needs user:delete). */
  remove: async (id: string) => {
    await apiRequest<null>(`/users/${id}`, { method: 'DELETE' });
  },
};
