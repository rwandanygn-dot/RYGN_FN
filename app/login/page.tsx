'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Lock, Mail } from 'lucide-react'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthSwitch, FormAlert, SubmitButton } from '@/components/auth/auth-ui'
import { compactErrors, emailError } from '@/components/auth/password-rules'
import { GuestOnly } from '@/components/auth/require-auth'
import { TextInput } from '@/components/brand/form'
import { useLogin, useResendVerification } from '@/hooks/use-auth'

type Errors = Partial<Record<'email' | 'password', string>>

const REMEMBERED_EMAIL_KEY = 'rygn:remembered-email'

function LoginForm() {
  const login = useLogin()
  const resend = useResendVerification()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState<Errors>({})

  // "Remember me" pre-fills the email on this device next time.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBERED_EMAIL_KEY)
      if (saved) {
        setEmail(saved)
        setRemember(true)
      }
    } catch {
      /* storage unavailable (private mode): ignore */
    }
  }, [])

  const normalizedEmail = email.trim().toLowerCase()

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (login.isPending) return
    const e = compactErrors({ email: emailError(email), password: password ? undefined : 'Password is required' })
    setErrors(e)
    if (Object.keys(e).length) return

    resend.reset()
    login.mutate(
      { email: normalizedEmail, password },
      {
        // <GuestOnly> redirects once the session is stored.
        onSuccess: () => {
          try {
            if (remember) localStorage.setItem(REMEMBERED_EMAIL_KEY, normalizedEmail)
            else localStorage.removeItem(REMEMBERED_EMAIL_KEY)
          } catch {
            /* ignore */
          }
        },
        onError: (error) => {
          setErrors(error.fieldErrors)
          setPassword('')
        },
      },
    )
  }

  const notVerified = login.error?.code === 'EMAIL_NOT_VERIFIED'

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to access your account and be part of the RYGN community.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormAlert error={login.error}>
          {notVerified && (
            <p className="mt-1">
              {resend.isSuccess ? (
                resend.data
              ) : (
                <button
                  type="button"
                  className="font-semibold underline disabled:opacity-60"
                  disabled={resend.isPending}
                  onClick={() => resend.mutate(normalizedEmail)}
                >
                  {resend.isPending ? 'Sending…' : 'Resend the verification email'}
                </button>
              )}
            </p>
          )}
        </FormAlert>

        <TextInput
          id="email"
          icon={Mail}
          type="email"
          placeholder="Email address"
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={login.isPending}
        />
        <TextInput
          id="password"
          icon={Lock}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          maxLength={128}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={login.isPending}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer select-none items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-rygn-blue"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-medium text-rygn-blue hover:underline">
            Forgot password?
          </Link>
        </div>

        <SubmitButton pending={login.isPending} pendingLabel="Signing in…">
          Sign in
        </SubmitButton>
      </form>

      <AuthSwitch href="/register" label="Create a new account" />
    </AuthCard>
  )
}

export default function LoginPage() {
  return (
    <GuestOnly>
      <LoginForm />
    </GuestOnly>
  )
}
