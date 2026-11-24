'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ChevronLeft, KeyRound, Lock, Mail, User } from 'lucide-react'
import { AuthCard } from '@/components/auth/auth-card'
import { AuthInput } from '@/components/auth/auth-input'
import { EMAIL_RE, PasswordChecklist, passwordError } from '@/components/auth/password-rules'

type Field = 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword' | 'signupCode'
type Errors = Partial<Record<Field, string>>

const initial: Record<Field, string> = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  signupCode: '',
}

export default function RegisterPage() {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<Errors>({})

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  function validate(): Errors {
    const e: Errors = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    else if (form.firstName.trim().length > 100) e.firstName = 'Max 100 characters'
    if (!form.lastName.trim()) e.lastName = 'Last name is required'
    else if (form.lastName.trim().length > 100) e.lastName = 'Max 100 characters'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Invalid email address'
    const pwError = passwordError(form.password)
    if (pwError) e.password = pwError
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match'
    return e
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    // TODO: integrate with POST /auth/register
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      ...(form.signupCode.trim() && { signupCode: form.signupCode.trim() }),
    }
    console.log('register', payload)
  }

  return (
    <AuthCard title="Create an account" subtitle="Join the RYGN community and help shape the future of nuclear science in Rwanda.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AuthInput
            id="firstName"
            icon={User}
            placeholder="First name"
            autoComplete="given-name"
            maxLength={100}
            value={form.firstName}
            onChange={set('firstName')}
            error={errors.firstName}
          />
          <AuthInput
            id="lastName"
            icon={User}
            placeholder="Last name"
            autoComplete="family-name"
            maxLength={100}
            value={form.lastName}
            onChange={set('lastName')}
            error={errors.lastName}
          />
        </div>

        <AuthInput
          id="email"
          icon={Mail}
          type="email"
          placeholder="Email address"
          autoComplete="email"
          maxLength={254}
          value={form.email}
          onChange={set('email')}
          error={errors.email}
        />

        <div>
          <AuthInput
            id="password"
            icon={Lock}
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            maxLength={72}
            value={form.password}
            onChange={set('password')}
            error={errors.password}
          />
          <PasswordChecklist password={form.password} />
        </div>

        <AuthInput
          id="confirmPassword"
          icon={Lock}
          type="password"
          placeholder="Confirm password"
          autoComplete="new-password"
          maxLength={72}
          value={form.confirmPassword}
          onChange={set('confirmPassword')}
          error={errors.confirmPassword}
        />

        <div>
          <AuthInput
            id="signupCode"
            icon={KeyRound}
            placeholder="Signup code (optional)"
            autoComplete="off"
            value={form.signupCode}
            onChange={set('signupCode')}
            error={errors.signupCode}
          />
          <p className="mt-1.5 text-xs text-gray-500">Only needed if an administrator gave you one.</p>
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-lg bg-rygn-blue text-white font-semibold hover:brightness-95 active:brightness-90 transition-colors"
        >
          Create account
        </button>
      </form>

      <div className="my-6 flex items-center gap-4 text-sm text-gray-500">
        <span className="h-px flex-1 bg-gray-200" />
        or
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <Link href="/login" className="flex items-center justify-center gap-2 font-semibold text-rygn-blue hover:underline">
        <ChevronLeft className="h-4 w-4" />
        Already have an account? Sign in
      </Link>
    </AuthCard>
  )
}
