'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useSession } from '@/hooks/use-auth'

export const DEFAULT_REDIRECT = '/dashboard'

/** Where to go after signing in: ?redirect= if it's a same-site path (blocks //evil.com), else the dashboard. */
export function getRedirectTarget(): string {
  const target = new URLSearchParams(window.location.search).get('redirect')
  return target && target.startsWith('/') && !target.startsWith('//') ? target : DEFAULT_REDIRECT
}

/** Renders children only for a signed-in user; otherwise sends them to /login and back afterwards. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
  }, [isLoading, user, router, pathname])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rygn-surface" role="status" aria-label="Loading">
        <Loader2 className="h-8 w-8 animate-spin text-rygn-blue" />
      </div>
    )
  }
  return children
}

/**
 * For /login and /register: shows the page straight away, and sends a signed-in user
 * (restored from the refresh cookie, or just logged in) on to the redirect target.
 */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { user } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (user) router.replace(getRedirectTarget())
  }, [user, router])

  return children
}
