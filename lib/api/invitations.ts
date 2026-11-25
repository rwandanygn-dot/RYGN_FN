import type { AuthUser, UserRole } from '@/store/types';
import { apiRequest } from './client';

/** What the invited person sees before accepting (POST /invitations/verify). */
export interface InvitationPreview {
  email: string;
  role: UserRole;
  expiresAt: string;
}

/** Mirrors rygn_be acceptInvitationSchema. */
export interface AcceptInvitationInput {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
}

/** Mirrors rygn_be createInvitationSchema. */
export interface CreateInvitationInput {
  email: string;
  role: UserRole;
}

export const invitationsApi = {
  // Public: used by the invited person from the email link (/accept-invitation?token=…)
  verify: async (token: string) =>
    (await apiRequest<{ invitation: InvitationPreview }>('/invitations/verify', { method: 'POST', body: { token }, auth: false }))
      .data.invitation,
  accept: async (input: AcceptInvitationInput) =>
    (await apiRequest<{ user: AuthUser }>('/invitations/accept', { method: 'POST', body: input, auth: false })).message,

  // Needs user:invite
  create: async (input: CreateInvitationInput) =>
    (await apiRequest<{ emailSent: boolean }>('/invitations', { method: 'POST', body: input })).data,
};
