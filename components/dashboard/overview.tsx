'use client'

import Link from 'next/link'
import {
  CalendarDays,
  CalendarPlus,
  Clock,
  FileText,
  MessageSquare,
  UserCheck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Avatar } from '@/components/brand/avatar'
import { SelectInput } from '@/components/brand/form'
import { useCan } from '@/hooks/use-auth'
import { useUserCounts, useUsers } from '@/hooks/use-users'
import {
  MONTHLY_SIGNUPS,
  OVERVIEW_STATS,
  UPCOMING_EVENTS,
  USERS_BY_CATEGORY,
} from '@/lib/dashboard/sample-data'
import { formatDate, fullName } from '@/lib/users'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import type { Permission } from '@/store/types'
import { Panel } from './panel'

const ICON_TONE = {
  blue: 'bg-rygn-blue/10 text-rygn-blue-dark',
  yellow: 'bg-rygn-yellow/20 text-rygn-yellow-dark',
  navy: 'bg-rygn-navy/10 text-rygn-navy',
  green: 'bg-rygn-green/10 text-rygn-green',
}

export function StatCard({
  label,
  value,
  note,
  icon: Icon,
  tone,
}: {
  label: string
  /** undefined while loading (shows a dash). */
  value?: number
  note: string
  icon: LucideIcon
  tone: keyof typeof ICON_TONE
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-gray-600">{label}</p>
        <span className={cn('rounded-xl p-2.5', ICON_TONE[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="font-heading mt-4 text-4xl font-extrabold">{value ?? '—'}</p>
      <p className="mt-3 text-sm text-gray-600">{note}</p>
    </div>
  )
}

const PENDING_TAB = '/dashboard/users?tab=PENDING'

/** Top stat cards: user numbers are live, events/news are sample until that API exists. */
export function OverviewStats() {
  const canReadUsers = useCan('user:read')
  const counts = useUserCounts().data
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {canReadUsers && (
        <>
          <StatCard label="Active users" icon={Users} tone="blue" value={counts?.ACTIVE} note={counts ? `${counts.ALL} accounts in total` : 'Loading…'} />
          <StatCard label="Pending verification" icon={Clock} tone="yellow" value={counts?.PENDING} note="Waiting to verify their email" />
        </>
      )}
      <StatCard label="Upcoming events" icon={CalendarDays} tone="navy" {...OVERVIEW_STATS.upcomingEvents} />
      <StatCard label="News published" icon={FileText} tone="green" {...OVERVIEW_STATS.newsPublished} />
    </div>
  )
}

/** CSS bar chart; the last (current) month is highlighted in navy. */
export function SignupsChart() {
  const max = Math.max(...MONTHLY_SIGNUPS.map((m) => m.count))
  return (
    <Panel className="lg:col-span-2">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-heading text-lg font-bold">New members per month</h2>
        <SelectInput size="md" options={['Last 6 months', 'Last 12 months']} className="w-44 bg-rygn-surface" aria-label="Period" />
      </div>
      <div className="flex h-64 items-end gap-4 border-b border-gray-200 sm:gap-8" role="img" aria-label="New members per month">
        {MONTHLY_SIGNUPS.map((m, i) => (
          <div key={m.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-sm font-semibold">{m.count}</span>
            <div
              className={cn('w-full max-w-16 rounded-t-lg', i === MONTHLY_SIGNUPS.length - 1 ? 'bg-rygn-navy' : 'bg-rygn-blue')}
              style={{ height: `${(m.count / max) * 85}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 sm:gap-8">
        {MONTHLY_SIGNUPS.map((m) => (
          <span key={m.month} className="flex-1 text-center text-sm text-gray-500">
            {m.month}
          </span>
        ))}
      </div>
    </Panel>
  )
}

// Kept in this client module: icon components can't be passed as props from a Server Component.
const QUICK_ACTIONS: { label: string; href: string; icon: LucideIcon; permission?: Permission }[] = [
  { label: 'Manage users', href: '/dashboard/users', icon: UserCheck, permission: 'user:read' },
  { label: 'Write news', href: '/dashboard/events', icon: FileText },
  { label: 'Create event', href: '/dashboard/events', icon: CalendarPlus },
  { label: 'Open messages', href: '/dashboard/messages', icon: MessageSquare },
]

export function QuickActions() {
  const permissions = useAuthStore((s) => s.user?.permissions)
  const actions = QUICK_ACTIONS.filter((a) => !a.permission || permissions?.includes(a.permission))
  return (
    <Panel title="Quick actions">
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl border border-gray-200 bg-rygn-surface p-4 font-semibold transition hover:border-rygn-blue hover:bg-rygn-blue/5"
          >
            <Icon className="mb-3 h-6 w-6 text-rygn-blue-dark" />
            {label}
          </Link>
        ))}
      </div>
    </Panel>
  )
}

/** Newest accounts still waiting for email verification (live). */
export function PendingApprovals() {
  const canReadUsers = useCan('user:read')
  const { data, isPending, error } = useUsers({ page: 1, limit: 4, status: 'PENDING' })
  const users = data?.items ?? []
  if (!canReadUsers) return null

  return (
    <Panel title="Pending verification" action={{ label: 'View all', href: PENDING_TAB }}>
      <ul className="divide-y divide-gray-100 border-t border-gray-100">
        {users.map((u) => (
          <li key={u.id} className="flex items-center gap-3 py-3">
            <Avatar name={fullName(u)} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{fullName(u)}</p>
              <p className="truncate text-sm text-gray-500">{u.email}</p>
            </div>
            <span className="whitespace-nowrap text-sm text-gray-500">{formatDate(u.createdAt)}</span>
          </li>
        ))}
      </ul>
      {!isPending && users.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-500">{error ? error.message : 'Nobody is waiting for verification.'}</p>
      )}
    </Panel>
  )
}

export function UpcomingEvents() {
  return (
    <Panel title="Upcoming events" action={{ label: 'All events', href: '/dashboard/events' }}>
      <ul className="divide-y divide-gray-100 border-t border-gray-100">
        {UPCOMING_EVENTS.map((e) => (
          <li key={e.id} className="flex items-center gap-4 py-4">
            <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-rygn-navy">
              <span className="text-[11px] font-bold text-rygn-yellow">{e.month}</span>
              <span className="font-heading text-xl font-extrabold leading-none text-white">{e.day}</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold">{e.title}</p>
              <p className="text-sm text-gray-500">{e.details}</p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

const CATEGORY_BAR = ['bg-rygn-blue', 'bg-rygn-navy', 'bg-rygn-blue-dark', 'bg-gray-400']

export function UsersByCategory() {
  return (
    <Panel title="Users by category">
      <ul className="space-y-5">
        {USERS_BY_CATEGORY.map((c, i) => (
          <li key={c.category}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold">{c.category}</span>
              <span className="text-gray-500">{c.percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div className={cn('h-full rounded-full', CATEGORY_BAR[i % CATEGORY_BAR.length])} style={{ width: `${c.percent}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
