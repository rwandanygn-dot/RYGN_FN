'use client'

import { useState, type FormEvent } from 'react'
import { KeyRound, Lock, Mail, MailCheck, User } from 'lucide-react'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthResult, AuthSwitch, FormAlert, SubmitButton } from '@/components/auth/auth-ui'
import {
  PasswordChecklist,
  compactErrors,
  confirmPasswordError,
  emailError,
  nameError,
  passwordError,
} from '@/components/auth/password-rules'
import { GuestOnly } from '@/components/auth/require-auth'
import { Button } from '@/components/brand/button'
import { TextInput } from '@/components/brand/form'
import { useRegister, useResendVerification } from '@/hooks/use-auth'

const EMPTY = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', signupCode: '' }
type Form = typeof EMPTY
type Errors = Partial<Record<keyof Form, string>>

/**
 * POST /auth/register. The backend creates an administrator account: the first one
 * freely, later ones only with the signup code. Editors join through an invitation.
 */
function RegisterForm() {
  const register = useRegister()
  const resend = useResendVerification()
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})

  const set = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const email = form.email.trim().toLowerCase()

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (register.isPending) return
    const e = compactErrors({
      firstName: nameError(form.firstName, 'First name'),
      lastName: nameError(form.lastName, 'Last name'),
      email: emailError(form.email),
      password: passwordError(form.password),
      confirmPassword: confirmPasswordError(form.password, form.confirmPassword),
    })
    setErrors(e)
    if (Object.keys(e).length) return

    // Only the fields registerSchema accepts; confirmPassword stays in the browser.
    register.mutate(
      {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email,
        password: form.password,
        ...(form.signupCode.trim() && { signupCode: form.signupCode.trim() }),
      },
      { onError: (error) => setErrors(error.fieldErrors) },
    )
  }

  if (register.isSuccess) {
    return (
      <AuthResult title="Check your email" subtitle={register.data} icon={MailCheck} tone="success" action={{ href: '/login', label: 'Go to sign in' }}>
        <p className="mt-4 break-all text-center font-semibold text-rygn-navy">{email}</p>
        <p className="mt-2 text-center text-sm text-gray-600">Open the link in the email to activate your account, then sign in.</p>
        <Button variant="outline" size="lg" className="mt-6 w-full" disabled={resend.isPending || resend.isSuccess} onClick={() => resend.mutate(email)}>
          {resend.isSuccess ? 'Email sent again' : resend.isPending ? 'Sending…' : 'Resend the email'}
        </Button>
      </AuthResult>
    )
  }

  const field = (name: keyof Form) => ({
    id: name,
    value: form[name],
    onChange: set(name),
    error: errors[name],
    disabled: register.isPending,
  })

  return (
    <AuthCard title="Create an account" subtitle="Set up your RYGN dashboard account. We’ll email you a link to confirm your address.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormAlert error={register.error} />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput {...field('firstName')} icon={User} placeholder="First name" autoComplete="given-name" maxLength={100} />
          <TextInput {...field('lastName')} icon={User} placeholder="Last name" autoComplete="family-name" maxLength={100} />
        </div>
        <TextInput {...field('email')} icon={Mail} type="email" placeholder="Email address" autoComplete="email" maxLength={254} />
        <div>
          <TextInput {...field('password')} icon={Lock} type="password" placeholder="Password" autoComplete="new-password" maxLength={72} />
          <PasswordChecklist password={form.password} />
        </div>
        <TextInput
          {...field('confirmPassword')}
          icon={Lock}
          type="password"
          placeholder="Confirm password"
          autoComplete="new-password"
          maxLength={72}
        />
        <div>
          <TextInput {...field('signupCode')} icon={KeyRound} type="password" placeholder="Signup code (if you have one)" autoComplete="off" />
          <p className="mt-1.5 text-xs text-gray-500">Needed once the first administrator exists. Editors join through an email invitation instead.</p>
        </div>

        <SubmitButton pending={register.isPending} pendingLabel="Creating account…">
          Create account
        </SubmitButton>
      </form>

      <AuthSwitch href="/login" label="I already have an account" />
    </AuthCard>
  )
}

export default function RegisterPage() {
  return (
    <GuestOnly>
      <RegisterForm />
    </GuestOnly>
  )
}
