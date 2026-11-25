'use client'

import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { ChevronDown, Eye, EyeOff, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Border/focus styles shared by every input and select. */
const controlClass = (error?: string) =>
  cn(
    'rounded-lg border bg-white transition-colors focus-within:ring-2',
    error
      ? 'border-red-400 focus-within:ring-red-100'
      : 'border-gray-200 focus-within:border-rygn-blue focus-within:ring-rygn-blue/20',
  )

/** Label + control + error message. */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string
  htmlFor?: string
  error?: string
  hint?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-rygn-navy">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
    </div>
  )
}

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'prefix' | 'size'> {
  icon?: LucideIcon
  /** Fixed text before the input, e.g. "+250". */
  prefix?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'search'
  error?: string
  /** Show the error under the input (default). Set false when a <Field> shows it. */
  showError?: boolean
  size?: 'md' | 'lg'
  /** Extra classes for the bordered box (e.g. a grey background). */
  controlClassName?: string
}

/** Text input with optional icon, prefix, password visibility toggle and inline error. */
export function TextInput({
  icon: Icon,
  prefix,
  type = 'text',
  error,
  showError = true,
  size = 'lg',
  id,
  className,
  controlClassName,
  ...props
}: TextInputProps) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const errorId = error && id ? `${id}-error` : undefined
  const height = size === 'lg' ? 'h-12' : 'h-11'

  return (
    <div className={className}>
      <div className="flex gap-2">
        {prefix && (
          <span className={cn('flex items-center rounded-lg border border-gray-200 bg-rygn-surface px-4 font-medium text-rygn-navy', height)}>
            {prefix}
          </span>
        )}
        <div className={cn('flex flex-1 items-center gap-3 px-4', height, controlClass(error), controlClassName)}>
          {Icon && <Icon className="h-5 w-5 shrink-0 text-gray-500" aria-hidden="true" />}
          <input
            id={id}
            type={isPassword && visible ? 'text' : type}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className="min-w-0 flex-1 bg-transparent text-sm text-rygn-navy outline-none placeholder:text-gray-500 disabled:opacity-60"
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="text-gray-500 hover:text-gray-700"
              aria-label={visible ? 'Hide password' : 'Show password'}
            >
              {visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>
      {showError && error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export type SelectOption = string | { value: string; label: string }

interface SelectInputProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Plain strings, or { value, label } when the value sent differs from the text shown. */
  options: readonly SelectOption[]
  /** Text for the empty first option, e.g. "All provinces". */
  placeholder?: string
  error?: string
  size?: 'md' | 'lg'
}

/** Native select styled like TextInput. */
export function SelectInput({ options, placeholder, error, size = 'lg', className, ...props }: SelectInputProps) {
  const autoId = useId()
  return (
    <div className={cn('relative', controlClass(error), className)}>
      <select
        id={props.id ?? autoId}
        aria-invalid={!!error}
        className={cn(
          'w-full appearance-none bg-transparent pl-4 pr-10 text-sm text-rygn-navy outline-none',
          size === 'lg' ? 'h-12' : 'h-11',
        )}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const { value, label } = typeof o === 'string' ? { value: o, label: o } : o
          return (
            <option key={value} value={value}>
              {label}
            </option>
          )
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    </div>
  )
}
