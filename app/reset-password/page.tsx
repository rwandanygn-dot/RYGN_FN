'use client'

import { Suspense, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, CircleCheck, Lock, TriangleAlert } from 'lucide-react'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthInput } from '@/components/auth/auth-input'
import { PasswordChecklist, passwordError } from '@/components/auth/password-rules'

type Errors = Partial<Record<'password' | 'confirmPassword', string>>

const primaryButton =
  'flex w-full h-12 items-center justify-center rounded-lg bg-rygn-blue text-white font-semibold hover:brightness-95 active:brightness-90 transition-colors'

function ResetPasswordForm() {
  // The email link is /reset-password?token=... (backend: frontendLink("/reset-password", token))
  const token = useSearchParams().get('token')?.trim() ?? ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)

  // Backend tokenField requires 20–200 characters
  if (token.length < 20 || token.length > 200) {
    return (
      <AuthCard title="Invalid reset link" subtitle="This password reset link is missing or malformed. Request a new one to continue.">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rygn-yellow/15">
            <TriangleAlert className="h-8 w-8 text-rygn-yellow" />
          </div>
        </div>
        <Link href="/forgot-password" className={`mt-8 ${primaryButton}`}>
          Request a new link
        </Link>
        <Link href="/login" className="mt-6 flex items-center justify-center gap-2 font-semibold text-rygn-blue hover:underline">
          <ChevronLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </AuthCard>
    )
  }

  if (done) {
    return (
      <AuthCard title="Password updated" subtitle="Your password has been reset. You can now sign in with your new password.">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rygn-green/10">
            <CircleCheck className="h-8 w-8 text-rygn-green" />
          </div>
        </div>
        <Link href="/login" className={`mt-8 ${primaryButton}`}>
          Sign in
        </Link>
      </AuthCard>
    )
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e: Errors = {}
    const pwError = passwordError(password)
    if (pwError) e.password = pwError
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (confirmPassword !== password) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    if (Object.keys(e).length) return
    // TODO: integrate with POST /auth/reset-password
    console.log('reset-password', { token, password })
    setDone(true)
  }

  return (
    <AuthCard title="Reset password" subtitle="Choose a new password for your RYGN account.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <AuthInput
            id="password"
            icon={Lock}
            type="password"
            placeholder="New password"
            autoComplete="new-password"
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <PasswordChecklist password={password} />
        </div>
        <AuthInput
          id="confirmPassword"
          icon={Lock}
          type="password"
          placeholder="Confirm new password"
          autoComplete="new-password"
          maxLength={72}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />
        <button type="submit" className={primaryButton}>
          Reset password
        </button>
      </form>
      <Link href="/login" className="mt-6 flex items-center justify-center gap-2 font-semibold text-rygn-blue hover:underline">
        <ChevronLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </AuthCard>
  )
}

export default function ResetPasswordPage() {
  // useSearchParams needs a Suspense boundary in the App Router
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
