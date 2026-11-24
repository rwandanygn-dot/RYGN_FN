'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ChevronLeft, Mail, MailCheck } from 'lucide-react'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthInput } from '@/components/auth/auth-input'
import { EMAIL_RE } from '@/components/auth/password-rules'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sentTo, setSentTo] = useState<string | null>(null)

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const value = email.trim().toLowerCase()
    if (!value) return setError('Email is required')
    if (!EMAIL_RE.test(value)) return setError('Invalid email address')
    setError('')
    // TODO: integrate with POST /auth/forgot-password
    console.log('forgot-password', { email: value })
    setSentTo(value)
  }

  const backToLogin = (
    <Link href="/login" className="mt-6 flex items-center justify-center gap-2 font-semibold text-rygn-blue hover:underline">
      <ChevronLeft className="h-4 w-4" />
      Back to sign in
    </Link>
  )

  if (sentTo) {
    return (
      <AuthCard title="Check your email" subtitle="If an account exists for this address, we've sent a link to reset your password.">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rygn-green/10">
            <MailCheck className="h-8 w-8 text-rygn-green" />
          </div>
          <p className="mt-4 font-semibold text-rygn-navy break-all">{sentTo}</p>
          <p className="mt-2 text-sm text-gray-600">The link expires soon. Check your spam folder if you don&apos;t see it.</p>
        </div>

        <button
          type="button"
          onClick={() => setSentTo(null)}
          className="mt-8 w-full h-12 rounded-lg border border-rygn-blue text-rygn-blue font-semibold hover:bg-rygn-blue/5 transition-colors"
        >
          Use a different email
        </button>
        {backToLogin}
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Forgot password?" subtitle="Enter the email you registered with and we'll send you a link to reset your password.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthInput
          id="email"
          icon={Mail}
          type="email"
          placeholder="Email address"
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
        <button
          type="submit"
          className="w-full h-12 rounded-lg bg-rygn-blue text-white font-semibold hover:brightness-95 active:brightness-90 transition-colors"
        >
          Send reset link
        </button>
      </form>
      {backToLogin}
    </AuthCard>
  )
}
