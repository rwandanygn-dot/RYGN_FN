import Link from 'next/link'
import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
}

/** Shared shell for the login / register pages: background, card, logo and heading. */
export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-rygn-blue/5 via-white to-rygn-green/5">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-100 shadow-xl shadow-rygn-navy/5 px-6 py-8 sm:px-10 sm:py-10">
        <Link href="/" className="flex justify-center mb-6" aria-label="RYGN home">
          <img src="/images/logo.PNG" alt="RYGN - Rwandan Young Generation in Nuclear" className="h-16 sm:h-20 w-auto object-contain" />
        </Link>

        <h1 className="text-center text-3xl font-bold text-rygn-navy">{title}</h1>
        <p className="mt-3 text-center text-sm text-gray-600 leading-relaxed">{subtitle}</p>

        <div className="mt-8">{children}</div>
      </div>
    </main>
  )
}
