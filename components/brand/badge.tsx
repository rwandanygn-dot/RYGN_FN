import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type Tone = 'green' | 'blue' | 'yellow' | 'gray' | 'red' | 'navy'

const BADGE_TONE: Record<Tone, string> = {
  green: 'bg-rygn-green/10 text-rygn-green',
  blue: 'bg-rygn-blue/10 text-rygn-blue-dark',
  yellow: 'bg-rygn-yellow/20 text-rygn-yellow-dark',
  gray: 'bg-gray-100 text-gray-600',
  red: 'bg-red-50 text-red-700',
  navy: 'bg-rygn-navy text-white',
}

export const DOT_TONE: Record<Tone, string> = {
  green: 'bg-rygn-green',
  blue: 'bg-rygn-blue',
  yellow: 'bg-rygn-yellow',
  gray: 'bg-gray-300',
  red: 'bg-red-500',
  navy: 'bg-rygn-navy',
}

/** Colour for every status used in the app, so a status looks the same everywhere. */
export const STATUS_TONE: Record<string, Tone> = {
  Published: 'green',
  Active: 'green',
  Scheduled: 'blue',
  'In review': 'yellow',
  Pending: 'yellow',
  Draft: 'gray',
  Suspended: 'red',
}

export function Badge({ tone = 'gray', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap', BADGE_TONE[tone], className)}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONE[status] ?? 'gray'}>{status}</Badge>
}

/** Small yellow count bubble (sidebar, tabs). */
export function CountBadge({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-rygn-yellow px-1.5 text-xs font-bold text-rygn-navy',
        className,
      )}
    >
      {count}
    </span>
  )
}
