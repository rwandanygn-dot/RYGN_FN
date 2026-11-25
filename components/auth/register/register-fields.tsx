'use client'

import type { ComponentProps } from 'react'
import { Check } from 'lucide-react'
import { Field, SelectInput, TextInput } from '@/components/brand/form'
import { cn } from '@/lib/utils'
import { useRegisterStore } from '@/store/register-store'
import type { RegisterFormData } from '@/store/types'

type TextKey = { [K in keyof RegisterFormData]: RegisterFormData[K] extends string ? K : never }[keyof RegisterFormData]
type BoolKey = 'acceptTerms' | 'newsletter'

/** Value, error and change handler for one string field of the register store. */
function useRegisterField(name: TextKey) {
  const value = useRegisterStore((s) => s.formData[name])
  const error = useRegisterStore((s) => s.errors[name])
  const setField = useRegisterStore((s) => s.setField)
  return { value, error, onChange: (value: string) => setField(name, value) }
}

export function RegisterInput({
  name,
  label,
  hint,
  className,
  ...props
}: { name: TextKey; label: string; hint?: string } & Omit<ComponentProps<typeof TextInput>, 'name' | 'value' | 'onChange' | 'error'>) {
  const { value, error, onChange } = useRegisterField(name)
  return (
    <Field label={label} htmlFor={name} error={error} hint={hint} className={className}>
      <TextInput id={name} name={name} value={value} onChange={(e) => onChange(e.target.value)} error={error} showError={false} {...props} />
    </Field>
  )
}

export function RegisterSelect({
  name,
  label,
  options,
  placeholder,
}: {
  name: TextKey
  label: string
  options: readonly string[]
  placeholder: string
}) {
  const { value, error, onChange } = useRegisterField(name)
  return (
    <Field label={label} htmlFor={name} error={error}>
      <SelectInput id={name} name={name} options={options} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} error={error} />
    </Field>
  )
}

export function RegisterCheckbox({ name, children }: { name: BoolKey; children: React.ReactNode }) {
  const checked = useRegisterStore((s) => s.formData[name])
  const error = useRegisterStore((s) => s.errors[name])
  const setField = useRegisterStore((s) => s.setField)
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setField(name, e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-rygn-blue-dark"
        />
        <span>{children}</span>
      </label>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}

/** Toggle chip used for interest topics. */
export function TopicChip({ topic }: { topic: string }) {
  const selected = useRegisterStore((s) => s.formData.interests.includes(topic))
  const toggleInterest = useRegisterStore((s) => s.toggleInterest)
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => toggleInterest(topic)}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition',
        selected ? 'border-rygn-blue bg-rygn-blue/10 text-rygn-blue-dark' : 'border-gray-200 text-gray-700 hover:bg-gray-50',
      )}
    >
      {selected && <Check className="h-4 w-4" />}
      {topic}
    </button>
  )
}
