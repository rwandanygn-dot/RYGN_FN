import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { RequireAuth } from '@/components/auth/require-auth'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'

export const metadata: Metadata = { title: 'Dashboard · RYGN' }

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <DashboardShell>{children}</DashboardShell>
    </RequireAuth>
  )
}
