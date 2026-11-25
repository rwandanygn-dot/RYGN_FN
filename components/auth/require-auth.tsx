'use client'

import { useEffect, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useSession } from '@/hooks/use-auth'

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
