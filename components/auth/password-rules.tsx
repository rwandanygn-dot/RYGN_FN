import { Check } from 'lucide-react'

// Mirrors the backend passwordField rules (rygn_be/src/validators/common.validator.ts)
export const PASSWORD_RULES = [
  { label: '8–72 characters', test: (p: string) => p.length >= 8 && p.length <= 72 },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
]

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Returns an error message for an invalid password, or undefined if it passes every rule. */
export function passwordError(password: string): string | undefined {
  if (!password) return 'Password is required'
  const failed = PASSWORD_RULES.find((r) => !r.test(password))
  return failed && `Password needs: ${failed.label.toLowerCase()}`
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
