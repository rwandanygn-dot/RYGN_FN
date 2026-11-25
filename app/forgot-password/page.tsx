'use client'

import { useState, type FormEvent } from 'react'
import { Mail, MailCheck } from 'lucide-react'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthResult, BackToLogin, FormAlert, SubmitButton } from '@/components/auth/auth-ui'
import { emailError } from '@/components/auth/password-rules'
import { Button } from '@/components/brand/button'
import { TextInput } from '@/components/brand/form'
import { useForgotPassword } from '@/hooks/use-auth'

/** POST /auth/forgot-password — emails a link to /reset-password?token=… */
export default function ForgotPasswordPage() {
  const forgot = useForgotPassword()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (forgot.isPending) return
    const e = emailError(email)
    setError(e)
    if (e) return
    forgot.mutate(email.trim().toLowerCase(), { onError: (err) => setError(err.fieldErrors.email) })
  }

  if (forgot.isSuccess) {
    return (
      <AuthResult title="Check your email" subtitle={forgot.data} icon={MailCheck} tone="success">
        <p className="mt-4 break-all text-center font-semibold text-rygn-navy">{forgot.variables}</p>
        <p className="mt-2 text-center text-sm text-gray-600">The link expires soon. Check your spam folder if you don’t see it.</p>
        <Button variant="outline" size="lg" className="mt-8 w-full" onClick={() => forgot.reset()}>
          Use a different email
        </Button>
      </AuthResult>
    )
  }

  return (
    <AuthCard title="Forgot password?" subtitle="Enter the email you registered with and we’ll send you a link to reset your password.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormAlert error={forgot.error} />
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
          disabled={forgot.isPending}
        />
        <SubmitButton pending={forgot.isPending} pendingLabel="Sending…">
          Send reset link
        </SubmitButton>
      </form>
      <BackToLogin />
    </AuthCard>
  )
}
