import { CalendarDays, House, MessageSquare, UserCog, Users, type LucideIcon } from 'lucide-react'
import type { Permission } from '@/store/types'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  /** Hidden unless the signed-in user's role has this permission. */
  permission?: Permission
}

export const DASHBOARD_HOME = '/dashboard'
export const PROFILE_HREF = '/dashboard/profile'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: DASHBOARD_HOME, icon: House },
  { label: 'Users', href: '/dashboard/users', icon: Users, permission: 'user:read' },
  { label: 'Events & News', href: '/dashboard/events', icon: CalendarDays },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'My account', href: PROFILE_HREF, icon: UserCog },
]

export function isActive(pathname: string, href: string) {
  return href === DASHBOARD_HOME ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
}
