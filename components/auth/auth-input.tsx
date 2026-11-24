'use client'

import { useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff, type LucideIcon } from 'lucide-react'

interface AuthInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  icon: LucideIcon
  type?: 'text' | 'email' | 'password'
  error?: string
}

/** Input with a leading icon, optional password visibility toggle and inline error. */
export function AuthInput({ icon: Icon, type = 'text', error, id, className, ...props }: AuthInputProps) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'
  const errorId = error && id ? `${id}-error` : undefined

  return (
    <div className={className}>
      <div
        className={`flex items-center gap-3 rounded-lg border bg-white px-4 h-12 transition-colors focus-within:ring-2 ${
          error
            ? 'border-red-400 focus-within:ring-red-100'
            : 'border-gray-300 focus-within:border-rygn-blue focus-within:ring-rygn-blue/20'
        }`}
      >
        <Icon className="h-5 w-5 shrink-0 text-gray-600" aria-hidden="true" />
        <input
          id={id}
          type={isPassword && visible ? 'text' : type}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className="flex-1 min-w-0 bg-transparent text-sm text-rygn-navy placeholder:text-gray-500 outline-none"
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
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
