'use client'

import { Suspense, useState, type FormEvent } from 'react'
import { CircleCheck, Lock } from 'lucide-react'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthResult, BackToLogin, FormAlert, InvalidLink, SubmitButton, useTokenParam } from '@/components/auth/auth-ui'
import { PasswordChecklist, compactErrors, confirmPasswordError, passwordError } from '@/components/auth/password-rules'
import { TextInput } from '@/components/brand/form'
import { useResetPassword } from '@/hooks/use-auth'

type Errors = Partial<Record<'password' | 'confirmPassword', string>>

const NEW_LINK = { href: '/forgot-password', label: 'Request a new link' }

/** POST /auth/reset-password — opened from the email link /reset-password?token=… */
function ResetPasswordForm() {
  const token = useTokenParam()
  const reset = useResetPassword()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  if (!token || reset.error?.code === 'INVALID_OR_EXPIRED_TOKEN') return <InvalidLink what="password reset" action={NEW_LINK} />

  if (reset.isSuccess) {
    return (
      <AuthResult title="Password updated" subtitle={reset.data} icon={CircleCheck} tone="success" action={{ href: '/login', label: 'Sign in' }} />
    )
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (reset.isPending) return
    const e = compactErrors({ password: passwordError(password), confirmPassword: confirmPasswordError(password, confirmPassword) })
    setErrors(e)
    if (Object.keys(e).length) return
    reset.mutate({ token: token!, password }, { onError: (error) => setErrors(error.fieldErrors) })
  }

  return (
    <AuthCard title="Reset password" subtitle="Choose a new password for your RYGN account. You’ll be signed out on every device.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormAlert error={reset.error} />
        <div>
          <TextInput
            id="password"
            icon={Lock}
            type="password"
            placeholder="New password"
            autoComplete="new-password"
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            disabled={reset.isPending}
          />
          <PasswordChecklist password={password} />
        </div>
        <TextInput
          id="confirmPassword"
          icon={Lock}
          type="password"
          placeholder="Confirm new password"
          autoComplete="new-password"
          maxLength={72}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          disabled={reset.isPending}
        />
        <SubmitButton pending={reset.isPending} pendingLabel="Saving…">
          Reset password
        </SubmitButton>
      </form>
      <BackToLogin />
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
