'use client'

import { Suspense, useState, type FormEvent } from 'react'
import { CircleCheck, Loader2, Mail, MailCheck } from 'lucide-react'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthResult, BackToLogin, FormAlert, StatusIcon, SubmitButton, useTokenParam } from '@/components/auth/auth-ui'
import { emailError } from '@/components/auth/password-rules'
import { TextInput } from '@/components/brand/form'
import { useResendVerification, useVerifyEmail } from '@/hooks/use-auth'

/** Lets someone with a dead link ask for a new one (POST /auth/resend-verification). */
function ResendForm({ title, subtitle }: { title: string; subtitle: string }) {
  const resend = useResendVerification()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()

  if (resend.isSuccess) return <AuthResult title="Check your email" subtitle={resend.data} icon={MailCheck} tone="success" />

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = emailError(email)
    setError(e)
    if (!e) resend.mutate(email.trim().toLowerCase(), { onError: (err) => setError(err.fieldErrors.email) })
  }

  return (
    <AuthCard title={title} subtitle={subtitle}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormAlert error={resend.error} />
        <TextInput
          id="email"
          icon={Mail}
          type="email"
          placeholder="Email address"
          autoComplete="email"
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          disabled={resend.isPending}
        />
        <SubmitButton pending={resend.isPending} pendingLabel="Sending…">
          Send a new link
        </SubmitButton>
      </form>
      <BackToLogin />
    </AuthCard>
  )
}

/** POST /auth/verify-email — opened from the email link /verify-email?token=… */
function VerifyEmail() {
  const token = useTokenParam()
  const verify = useVerifyEmail(token)

  if (!token || verify.isError) {
    return (
      <ResendForm
        title="Link not valid"
        subtitle={verify.error?.message ?? 'This verification link is invalid. Enter your email and we’ll send a new one.'}
      />
    )
  }

  if (verify.isPending) {
    return (
      <AuthCard title="Verifying your email" subtitle="One moment…">
        <StatusIcon icon={Loader2} tone="info" />
      </AuthCard>
    )
  }

  return <AuthResult title="Email verified" subtitle={verify.data} icon={CircleCheck} tone="success" action={{ href: '/login', label: 'Sign in' }} />
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  )
}
