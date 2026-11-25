import { CalendarDays, House, MessageSquare, Users, type LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const DASHBOARD_HOME = '/dashboard'

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: DASHBOARD_HOME, icon: House },
  { label: 'Users', href: '/dashboard/users', icon: Users },
  { label: 'Events & News', href: '/dashboard/events', icon: CalendarDays },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
]

export function isActive(pathname: string, href: string) {
  return href === DASHBOARD_HOME ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
}
