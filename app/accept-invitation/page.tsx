'use client'

import { Suspense, useState, type FormEvent } from 'react'
import { CircleCheck, Loader2, Lock, User } from 'lucide-react'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthResult, FormAlert, InvalidLink, StatusIcon, SubmitButton, useTokenParam } from '@/components/auth/auth-ui'
import {
  PasswordChecklist,
  compactErrors,
  confirmPasswordError,
  nameError,
  passwordError,
} from '@/components/auth/password-rules'
import { TextInput } from '@/components/brand/form'
import { useAcceptInvitation, useInvitation } from '@/hooks/use-auth'
import { ROLE_LABELS } from '@/lib/users'

const EMPTY = { firstName: '', lastName: '', password: '', confirmPassword: '' }
type Form = typeof EMPTY
type Errors = Partial<Record<keyof Form, string>>

const ASK_ADMIN = { href: '/login', label: 'Go to sign in' }

/**
 * Opened from the invitation email (/accept-invitation?token=…). Checks the link with
 * POST /invitations/verify, then creates the account with POST /invitations/accept.
 */
function AcceptInvitation() {
  const token = useTokenParam()
  const invitation = useInvitation(token)
  const accept = useAcceptInvitation()
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})

  if (!token || invitation.isError) return <InvalidLink what="invitation" action={ASK_ADMIN} />

  if (invitation.isPending) {
    return (
      <AuthCard title="Checking your invitation" subtitle="One moment…">
        <StatusIcon icon={Loader2} tone="info" />
      </AuthCard>
    )
  }

  if (accept.isSuccess) {
    return <AuthResult title="Account created" subtitle={accept.data} icon={CircleCheck} tone="success" action={{ href: '/login', label: 'Sign in' }} />
  }

  const { email, role } = invitation.data

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (accept.isPending) return
    const e = compactErrors({
      firstName: nameError(form.firstName, 'First name'),
      lastName: nameError(form.lastName, 'Last name'),
      password: passwordError(form.password),
      confirmPassword: confirmPasswordError(form.password, form.confirmPassword),
    })
    setErrors(e)
    if (Object.keys(e).length) return
    accept.mutate(
      { token: token!, firstName: form.firstName.trim(), lastName: form.lastName.trim(), password: form.password },
      { onError: (error) => setErrors(error.fieldErrors) },
    )
  }

  const field = (name: keyof Form) => ({
    id: name,
    value: form[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [name]: e.target.value })),
    error: errors[name],
    disabled: accept.isPending,
  })

  return (
    <AuthCard title="Join RYGN" subtitle={`You’ve been invited as ${ROLE_LABELS[role]}. Set up your account to get started.`}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormAlert error={accept.error} />
        <p className="rounded-lg bg-rygn-surface px-4 py-3 text-sm">
          Signing up as <span className="break-all font-semibold">{email}</span>
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput {...field('firstName')} icon={User} placeholder="First name" autoComplete="given-name" maxLength={100} />
          <TextInput {...field('lastName')} icon={User} placeholder="Last name" autoComplete="family-name" maxLength={100} />
        </div>
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
        <SubmitButton pending={accept.isPending} pendingLabel="Creating account…">
          Create account
        </SubmitButton>
      </form>
    </AuthCard>
  )
}

export default function AcceptInvitationPage() {
  return (
    <Suspense>
      <AcceptInvitation />
    </Suspense>
  )
}
