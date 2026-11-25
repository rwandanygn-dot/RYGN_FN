import { Check } from 'lucide-react'

// Mirrors the backend passwordField rules (rygn_be/src/validators/common.validator.ts)
export const PASSWORD_RULES = [
  { label: '8–72 characters', test: (p: string) => p.length >= 8 && p.length <= 72 },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
]

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Client-side checks that mirror rygn_be validators; each returns a message or undefined.

/** Returns an error message for an invalid password, or undefined if it passes every rule. */
export function passwordError(password: string): string | undefined {
  if (!password) return 'Password is required'
  const failed = PASSWORD_RULES.find((r) => !r.test(password))
  return failed && `Password needs: ${failed.label.toLowerCase()}`
}

export function emailError(email: string): string | undefined {
  if (!email.trim()) return 'Email is required'
  if (email.trim().length > 254 || !EMAIL_RE.test(email.trim())) return 'Invalid email address'
}

/** rygn_be nameField: trimmed, 1–100 characters. */
export function nameError(name: string, label: string): string | undefined {
  if (!name.trim()) return `${label} is required`
  if (name.trim().length > 100) return `${label} must be at most 100 characters`
}

export function confirmPasswordError(password: string, confirm: string): string | undefined {
  if (!confirm) return 'Please confirm your password'
  if (confirm !== password) return 'Passwords do not match'
}

/** Drops undefined entries so `Object.keys(errors).length` means "has errors". */
export function compactErrors<K extends string>(errors: Record<K, string | undefined>): Partial<Record<K, string>> {
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => v)) as Partial<Record<K, string>>
}

/** Live checklist shown under a new-password field. */
export function PasswordChecklist({ password }: { password: string }) {
  if (!password) return null
  return (
    <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
      {PASSWORD_RULES.map((r) => {
        const ok = r.test(password)
        return (
          <li key={r.label} className={`flex items-center gap-1.5 ${ok ? 'text-rygn-green' : 'text-gray-500'}`}>
            <Check className={`h-3.5 w-3.5 ${ok ? 'opacity-100' : 'opacity-30'}`} />
            {r.label}
          </li>
        )
      })}
    </ul>
  )
}

const STRENGTH = [
  { label: 'Too weak', bar: 'bg-red-500' },
  { label: 'Weak', bar: 'bg-red-500' },
  { label: 'Fair', bar: 'bg-rygn-yellow' },
  { label: 'Good', bar: 'bg-rygn-yellow' },
  { label: 'Strong', bar: 'bg-rygn-green' },
]

/** Four-bar strength meter: one bar per backend password rule that passes. */
export function PasswordStrength({ password }: { password: string }) {
  const score = PASSWORD_RULES.filter((r) => r.test(password)).length
  const { label, bar } = STRENGTH[score]
  return (
    <div>
      <div className="grid grid-cols-4 gap-2" aria-hidden="true">
        {PASSWORD_RULES.map((r, i) => (
          <span key={r.label} className={`h-1.5 rounded-full ${i < score ? bar : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-600" aria-live="polite">
        {password ? `${label} · ` : ''}8–72 characters with upper & lowercase letters and a number
      </p>
    </div>
  )
}
