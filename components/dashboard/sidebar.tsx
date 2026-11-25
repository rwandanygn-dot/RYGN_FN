'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Loader2, LogOut } from 'lucide-react'
import { Avatar } from '@/components/brand/avatar'
import { CountBadge } from '@/components/brand/badge'
import { useLogout } from '@/hooks/use-auth'
import { useUserCounts } from '@/hooks/use-users'
import { UNREAD_MESSAGES } from '@/lib/dashboard/sample-data'
import { cn } from '@/lib/utils'
import { fullName, roleLabel } from '@/lib/users'
import { useAuthStore } from '@/store/auth-store'
import { DASHBOARD_HOME, NAV_ITEMS, PROFILE_HREF, isActive } from './nav'

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  // Set by <RequireAuth>; briefly null while signing out.
  const user = useAuthStore((s) => s.user)
  const navItems = NAV_ITEMS.filter((item) => !item.permission || user?.permissions.includes(item.permission))
  const logout = useLogout()
  const pendingUsers = useUserCounts().data?.PENDING
  const badges: Record<string, number | undefined> = {
    '/dashboard/users': pendingUsers,
    '/dashboard/messages': UNREAD_MESSAGES, // sample until messages exist
  }

  return (
    <div className="flex h-full flex-col bg-rygn-navy px-4 py-6 text-white">
      <Link href={DASHBOARD_HOME} onClick={onNavigate} className="mb-10 inline-flex w-fit rounded-xl bg-white px-4 py-3">
        <img src="/images/logo.PNG" alt="RYGN" className="h-9 w-auto object-contain" />
      </Link>

      <nav aria-label="Dashboard" className="flex-1">
        <ul className="space-y-1.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const badge = badges[href]
            const active = isActive(pathname, href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-[15px] transition-colors',
                    active ? 'bg-rygn-green font-semibold' : 'text-white/85 hover:bg-white/10',
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{label}</span>
                  {badge ? <CountBadge count={badge} /> : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {user && (
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <Link href={PROFILE_HREF} onClick={onNavigate} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg hover:opacity-90">
            <Avatar name={fullName(user)} tone="blue" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold" title={user.email}>
                {fullName(user)}
              </p>
              <p className="text-xs text-white/70">{roleLabel(user)}</p>
            </div>
          </Link>
          <button
            type="button"
            aria-label="Sign out"
            title="Sign out"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="rounded-md p-2 text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-60"
          >
            {logout.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
          </button>
        </div>
      )}
    </div>
  )
}
