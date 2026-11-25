'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, CircleAlert, Loader2, Lock, Mail } from 'lucide-react'
import { AuthCard } from '@/components/auth/auth-card'
import { TextInput } from '@/components/brand/form'
import { buttonVariants } from '@/components/brand/button'
import { EMAIL_RE } from '@/components/auth/password-rules'
import { useLogin } from '@/hooks/use-auth'

type Errors = Partial<Record<'email' | 'password', string>>

const REMEMBERED_EMAIL_KEY = 'rygn:remembered-email'
const DEFAULT_REDIRECT = '/dashboard'

/** Only allow same-site relative paths from ?redirect= (blocks open redirects like //evil.com). */
function getRedirectTarget(): string {
  const target = new URLSearchParams(window.location.search).get('redirect')
  return target && target.startsWith('/') && !target.startsWith('//') ? target : DEFAULT_REDIRECT
}

export default function LoginPage() {
  const router = useRouter()
  const login = useLogin()

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

  function validate(): Errors {
    const e: Errors = {}
    if (!email.trim()) e.email = 'Email is required'
    else if (!EMAIL_RE.test(email.trim())) e.email = 'Invalid email address'
    if (!password) e.password = 'Password is required'
    return e
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (login.isPending) return
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    const normalizedEmail = email.trim().toLowerCase()
    login.mutate(
      { email: normalizedEmail, password },
      {
        onSuccess: () => {
          try {
            if (remember) localStorage.setItem(REMEMBERED_EMAIL_KEY, normalizedEmail)
            else localStorage.removeItem(REMEMBERED_EMAIL_KEY)
          } catch {
            /* ignore */
          }
          router.replace(getRedirectTarget())
        },
        onError: (error) => {
          setErrors(error.fieldErrors)
          setPassword('')
        },
      },
    )
  }

  // Field errors are shown on the inputs; everything else goes in the banner.
  const bannerError = login.error && Object.keys(login.error.fieldErrors).length === 0 ? login.error : null

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to access your account and be part of the RYGN community.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {bannerError && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{bannerError.message}</span>
          </div>
        )}

        <TextInput
          id="email"
          icon={Mail}
          type="email"
          placeholder="Email address"
          autoComplete="email"
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={login.isPending}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer select-none">
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

        <button
          type="submit"
          disabled={login.isPending}
          className={buttonVariants({ size: 'lg', className: 'w-full' })}
        >
          {login.isPending && <Loader2 className="h-5 w-5 animate-spin" />}
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4 text-sm text-gray-500">
        <span className="h-px flex-1 bg-gray-200" />
        or
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <Link href="/register" className="flex items-center justify-center gap-2 font-semibold text-rygn-blue hover:underline">
        Create a new account
        <ChevronRight className="h-4 w-4" />
      </Link>
    </AuthCard>
  )
}
