import { cn } from '@/lib/utils'

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')
}

const TONES = {
  light: 'bg-rygn-blue/10 text-rygn-blue-dark',
  navy: 'bg-rygn-navy text-white',
  blue: 'bg-rygn-blue text-rygn-navy',
}
const SIZES = { sm: 'h-10 w-10 text-sm', md: 'h-12 w-12 text-base', xl: 'h-24 w-24 text-3xl' }

/** Circle with the person's initials. */
export function Avatar({
  name,
  tone = 'light',
  size = 'sm',
  className,
}: {
  name: string
  tone?: keyof typeof TONES
  size?: keyof typeof SIZES
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-bold', TONES[tone], SIZES[size], className)}
    >
      {initials(name)}
    </span>
  )
}
