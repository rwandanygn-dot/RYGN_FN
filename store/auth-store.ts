import { create } from 'zustand';
import type { AuthStore } from './types';

/**
 * Current session. Kept in memory only: the access token is short-lived and the
 * long-lived refresh token lives in an httpOnly cookie the browser sends to /auth.
 */
export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  accessToken: null,

  setSession: (user, accessToken) => set({ user, accessToken }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  clearSession: () => set({ user: null, accessToken: null }),
}));

/** Selector: true when a user is signed in. */
export const selectIsAuthenticated = (state: AuthStore) => state.user !== null && state.accessToken !== null;
