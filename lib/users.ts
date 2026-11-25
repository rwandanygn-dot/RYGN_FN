import type { AuthUser, UserRole, UserStatus } from '@/store/types'

/** Values the backend accepts (Prisma enums), in display order. */
export const USER_ROLES: readonly UserRole[] = ['ADMIN', 'EDITOR']
export const USER_STATUSES: readonly UserStatus[] = ['PENDING', 'ACTIVE', 'SUSPENDED']

export const ROLE_LABELS: Record<UserRole, string> = { ADMIN: 'Administrator', EDITOR: 'Editor' }

/** Labels match STATUS_TONE in components/brand/badge, so badges get the right colour. */
export const STATUS_LABELS: Record<UserStatus, string> = { PENDING: 'Pending', ACTIVE: 'Active', SUSPENDED: 'Suspended' }

export const fullName = (user: Pick<AuthUser, 'firstName' | 'lastName'>) => `${user.firstName} ${user.lastName}`.trim()
export const roleLabel = (user: Pick<AuthUser, 'role'>) => ROLE_LABELS[user.role] ?? user.role

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

/** ISO date string → "24 Nov 2026"; null → fallback. */
export function formatDate(iso: string | null, fallback = '—') {
  return iso ? dateFormat.format(new Date(iso)) : fallback
}

/** Role choices for <SelectInput>: sends ADMIN/EDITOR, shows the readable label. */
export const ROLE_OPTIONS = USER_ROLES.map((role) => ({ value: role, label: ROLE_LABELS[role] }))
