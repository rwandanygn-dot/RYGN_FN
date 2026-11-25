'use client'

import { useState, type FormEvent } from 'react'
import { Loader2, LogOut, Monitor } from 'lucide-react'
import { PasswordChecklist, compactErrors, confirmPasswordError, nameError, passwordError } from '@/components/auth/password-rules'
import { Badge } from '@/components/brand/badge'
import { Button } from '@/components/brand/button'
import { Field, TextInput } from '@/components/brand/form'
import { PageHeader } from '@/components/dashboard/page-header'
import { Panel } from '@/components/dashboard/panel'
import { useChangePassword, useLogoutAll, useRevokeSession, useSessions, useUpdateProfile } from '@/hooks/use-auth'
import type { Session } from '@/lib/api/auth'
import { formatDate, roleLabel } from '@/lib/users'
import { useAuthStore } from '@/store/auth-store'
import type { CurrentUser } from '@/store/types'

/** PATCH /auth/me — first and last name only (email and role are managed elsewhere). */
function ProfileForm({ user }: { user: CurrentUser }) {
  const update = useUpdateProfile()
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [errors, setErrors] = useState<Partial<Record<'firstName' | 'lastName', string>>>({})
  const changed = firstName.trim() !== user.firstName || lastName.trim() !== user.lastName

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = compactErrors({ firstName: nameError(firstName, 'First name'), lastName: nameError(lastName, 'Last name') })
    setErrors(e)
    if (Object.keys(e).length) return
    update.mutate({ firstName: firstName.trim(), lastName: lastName.trim() }, { onError: (err) => setErrors(err.fieldErrors) })
  }

  return (
    <Panel title="Profile">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" htmlFor="firstName" error={errors.firstName}>
            <TextInput id="firstName" size="md" maxLength={100} value={firstName} onChange={(e) => setFirstName(e.target.value)} error={errors.firstName} showError={false} />
          </Field>
          <Field label="Last name" htmlFor="lastName" error={errors.lastName}>
            <TextInput id="lastName" size="md" maxLength={100} value={lastName} onChange={(e) => setLastName(e.target.value)} error={errors.lastName} showError={false} />
          </Field>
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="break-all font-semibold">{user.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Role</dt>
            <dd className="font-semibold">{roleLabel(user)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Member since</dt>
            <dd className="font-semibold">{formatDate(user.createdAt)}</dd>
          </div>
        </dl>
        <Button type="submit" disabled={!changed || update.isPending}>
          {update.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </Panel>
  )
}

const EMPTY_PASSWORDS = { currentPassword: '', newPassword: '', confirmPassword: '' }
type PasswordForm = typeof EMPTY_PASSWORDS

/** POST /auth/change-password — keeps this device signed in, signs out the others. */
function ChangePasswordForm() {
  const change = useChangePassword()
  const [form, setForm] = useState<PasswordForm>(EMPTY_PASSWORDS)
  const [errors, setErrors] = useState<Partial<Record<keyof PasswordForm, string>>>({})

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = compactErrors({
      currentPassword: form.currentPassword ? undefined : 'Current password is required',
      newPassword:
        passwordError(form.newPassword) ??
        (form.newPassword === form.currentPassword ? 'New password must be different from the current password' : undefined),
      confirmPassword: confirmPasswordError(form.newPassword, form.confirmPassword),
    })
    setErrors(e)
    if (Object.keys(e).length) return
    change.mutate(
      { currentPassword: form.currentPassword, newPassword: form.newPassword },
      {
        onSuccess: () => setForm(EMPTY_PASSWORDS),
        onError: (err) => setErrors(err.code === 'INVALID_CURRENT_PASSWORD' ? { currentPassword: err.message } : err.fieldErrors),
      },
    )
  }

  const input = (name: keyof PasswordForm, label: string, autoComplete: string) => (
    <Field label={label} htmlFor={name} error={errors[name]}>
      <TextInput
        id={name}
        type="password"
        size="md"
        maxLength={name === 'currentPassword' ? 128 : 72}
        autoComplete={autoComplete}
        value={form[name]}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
        error={errors[name]}
        showError={false}
      />
    </Field>
  )

  return (
    <Panel title="Change password">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {input('currentPassword', 'Current password', 'current-password')}
        <div>
          {input('newPassword', 'New password', 'new-password')}
          <PasswordChecklist password={form.newPassword} />
        </div>
        {input('confirmPassword', 'Confirm new password', 'new-password')}
        <Button type="submit" disabled={change.isPending}>
          {change.isPending ? 'Saving…' : 'Change password'}
        </Button>
      </form>
    </Panel>
  )
}

/** Rough "Chrome on Linux" label from a user-agent string. */
function describeDevice(ua: string | null) {
  if (!ua) return 'Unknown device'
  const browser = ['Edg', 'OPR', 'Firefox', 'Chrome', 'Safari'].find((b) => ua.includes(b))
  const os = ['Windows', 'Android', 'iPhone', 'iPad', 'Mac OS', 'Linux'].find((o) => ua.includes(o))
  const names: Record<string, string> = { Edg: 'Edge', OPR: 'Opera', 'Mac OS': 'macOS' }
  const name = (s?: string) => (s ? (names[s] ?? s) : undefined)
  return [name(browser) ?? 'Browser', name(os)].filter(Boolean).join(' on ')
}

/** GET /auth/sessions, DELETE /auth/sessions/:id, POST /auth/logout-all */
function Devices() {
  const { data: sessions, isPending, error } = useSessions()
  const revoke = useRevokeSession()
  const logoutAll = useLogoutAll()

  return (
    <Panel title="Signed-in devices">
      {isPending ? (
        <Loader2 className="mx-auto my-6 h-6 w-6 animate-spin text-rygn-blue" aria-label="Loading devices" />
      ) : error ? (
        <p className="text-sm text-red-600">{error.message}</p>
      ) : (
        <ul className="divide-y divide-gray-100 border-t border-gray-100">
          {sessions.map((s: Session) => (
            <li key={s.id} className="flex items-center gap-3 py-3">
              <Monitor className="h-5 w-5 shrink-0 text-gray-500" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-semibold">
                  {describeDevice(s.userAgent)}
                  {s.isCurrent && <Badge tone="green">This device</Badge>}
                </p>
                <p className="text-sm text-gray-500">
                  {s.ipAddress ?? 'Unknown IP'} · last active {formatDate(s.lastUsedAt)}
                </p>
              </div>
              {!s.isCurrent && (
                <Button variant="ghostDanger" size="sm" disabled={revoke.isPending} onClick={() => revoke.mutate(s.id)}>
                  Sign out
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
      <Button variant="danger" className="mt-4 w-full" disabled={logoutAll.isPending} onClick={() => logoutAll.mutate()}>
        <LogOut className="h-4 w-4" />
        {logoutAll.isPending ? 'Signing out…' : 'Sign out on all devices'}
      </Button>
    </Panel>
  )
}

export default function ProfilePage() {
  // Inside <RequireAuth>, so the user is always set (briefly null while signing out).
  const user = useAuthStore((s) => s.user)
  if (!user) return null

  return (
    <>
      <PageHeader title="My account" description="Your profile, password and signed-in devices." />
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <ProfileForm user={user} />
          <ChangePasswordForm />
        </div>
        <Devices />
      </div>
    </>
  )
}
