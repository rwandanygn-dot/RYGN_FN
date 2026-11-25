import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** White rounded card used for every dashboard section. */
export function Panel({
  title,
  action,
  flush = false,
  className,
  children,
}: {
  title?: string
  action?: { label: string; href: string }
  /** No side padding around the content (for edge-to-edge tables). */
  flush?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <section className={cn('rounded-2xl border border-gray-200 bg-white', flush ? 'py-6' : 'p-6', className)}>
      {(title || action) && (
        <div className={cn('mb-4 flex items-center justify-between gap-4', flush && 'px-6')}>
          {title && <h2 className="font-heading text-lg font-bold text-rygn-navy">{title}</h2>}
          {action && (
            <Link href={action.href} className="text-sm font-semibold text-rygn-blue-dark hover:underline">
              {action.label}
            </Link>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

/** Uppercase grey table header cell. */
export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th scope="col" className={cn('px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500', className)}>
      {children}
    </th>
  )
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn('px-6 py-4 align-middle', className)}>{children}</td>
}
