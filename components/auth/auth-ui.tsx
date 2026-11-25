'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, CircleAlert, Loader2, TriangleAlert, type LucideIcon } from 'lucide-react'
import { ButtonLink, buttonVariants } from '@/components/brand/button'
import type { ApiError } from '@/lib/api/client'
import { cn } from '@/lib/utils'
import { AuthCard } from './auth-card'

/**
 * Server error banner. Validation errors are shown on their fields instead, so the
 * banner only appears when the error isn't tied to a field (wrong password, rate limit…).
 */
export function FormAlert({ error, children }: { error: ApiError | null; children?: ReactNode }) {
  if (!error || Object.keys(error.fieldErrors).length > 0) return null
  return (
    <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1">
        {error.message}
        {children}
      </div>
    </div>
  )
}

/** Full-width primary submit button with a spinner while the request runs. */
export function SubmitButton({ pending, pendingLabel, children }: { pending: boolean; pendingLabel: string; children: ReactNode }) {
  return (
    <button type="submit" disabled={pending} className={buttonVariants({ size: 'lg', className: 'w-full' })}>
      {pending && <Loader2 className="h-5 w-5 animate-spin" />}
      {pending ? pendingLabel : children}
    </button>
  )
}

const ICON_TONE = {
  success: 'bg-rygn-green/10 text-rygn-green',
  warning: 'bg-rygn-yellow/15 text-rygn-yellow-dark',
  info: 'bg-rygn-blue/10 text-rygn-blue-dark',
}

/** Round icon used on result screens ("Check your email", "Password updated"…). */
export function StatusIcon({ icon: Icon, tone }: { icon: LucideIcon; tone: keyof typeof ICON_TONE }) {
  return (
    <div className={cn('mx-auto flex h-16 w-16 items-center justify-center rounded-full', ICON_TONE[tone])}>
      <Icon className={cn('h-8 w-8', Icon === Loader2 && 'animate-spin')} />

    </div>
  )
}

/** "or" divider + link to the other auth page (login ↔ register). */
export function AuthSwitch({ href, label }: { href: string; label: string }) {
  return (
    <>
      <div className="my-6 flex items-center gap-4 text-sm text-gray-500">
        <span className="h-px flex-1 bg-gray-200" />
        or
        <span className="h-px flex-1 bg-gray-200" />
      </div>
      <Link href={href} className="flex items-center justify-center gap-2 font-semibold text-rygn-blue hover:underline">
        {label}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </>
  )
}

export function BackToLogin({ label = 'Back to sign in' }: { label?: string }) {
  return (
    <Link href="/login" className="mt-6 flex items-center justify-center gap-2 font-semibold text-rygn-blue hover:underline">
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Link>
  )
}

/** Result screen: card + icon + optional extra content + primary link. */
export function AuthResult({
  title,
  subtitle,
  icon,
  tone,
  action,
  children,
}: {
  title: string
  subtitle: string
  icon: LucideIcon
  tone: keyof typeof ICON_TONE
  action?: { href: string; label: string }
  children?: ReactNode
}) {
  return (
    <AuthCard title={title} subtitle={subtitle}>
      <StatusIcon icon={icon} tone={tone} />
      {children}
      {action && (
        <ButtonLink href={action.href} size="lg" className="mt-8 w-full">
          {action.label}
        </ButtonLink>
      )}
      {action?.href !== '/login' && <BackToLogin />}
    </AuthCard>
  )
}

/** Shown when an email link has no usable ?token=. */
export function InvalidLink({ what, action }: { what: string; action: { href: string; label: string } }) {
  return (
    <AuthResult
      title="Invalid link"
      subtitle={`This ${what} link is invalid, has expired or was already used.`}
      icon={TriangleAlert}
      tone="warning"
      action={action}
    />
  )
}

/**
 * Token from an email link (?token=…). Returns null unless it fits rygn_be tokenField
 * (20–200 characters), so obviously broken links never reach the API.
 * Needs a <Suspense> boundary above it (useSearchParams).
 */
export function useTokenParam(): string | null {
  const token = useSearchParams().get('token')?.trim() ?? ''
  return token.length >= 20 && token.length <= 200 ? token : null
}
