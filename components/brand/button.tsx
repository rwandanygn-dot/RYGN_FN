import Link from 'next/link'
import type { ButtonHTMLAttributes, ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/** RYGN button styles. Navy text on blue/yellow keeps contrast readable. */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rygn-blue/40 disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-rygn-blue text-rygn-navy hover:brightness-95 active:brightness-90',
        accent: 'bg-rygn-yellow text-rygn-navy hover:brightness-95 active:brightness-90',
        success: 'bg-rygn-green text-white hover:brightness-110',
        outline: 'border border-gray-200 bg-white text-rygn-navy hover:bg-gray-50',
        danger: 'border border-red-300 bg-white text-red-700 hover:bg-red-50',
        ghost: 'text-rygn-navy hover:bg-gray-100',
        ghostDanger: 'text-red-700 hover:bg-red-50',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

type Variants = VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & Variants) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export function ButtonLink({ className, variant, size, ...props }: ComponentProps<typeof Link> & Variants) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
