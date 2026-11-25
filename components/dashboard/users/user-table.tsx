import { Avatar } from '@/components/brand/avatar'
import { StatusBadge } from '@/components/brand/badge'
import type { User } from '@/lib/api/users'
import { STATUS_LABELS, formatDate, fullName, roleLabel } from '@/lib/users'
import { cn } from '@/lib/utils'
import { Td, Th } from '../panel'

interface UserTableProps {
  users: User[]
  selectedIds: Set<string>
  activeId?: string
  onToggle: (id: string) => void
  onToggleAll: () => void
  onOpen: (id: string) => void
}

const checkboxClass = 'h-5 w-5 rounded border-gray-300 accent-rygn-blue-dark'

export function UserTable({ users, selectedIds, activeId, onToggle, onToggleAll, onOpen }: UserTableProps) {
  const allSelected = users.length > 0 && users.every((u) => selectedIds.has(u.id))

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-rygn-surface">
          <tr>
            <Th className="w-12 pr-0">
              <input type="checkbox" className={checkboxClass} checked={allSelected} onChange={onToggleAll} aria-label="Select all users on this page" />
            </Th>
            <Th>Member</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Last login</Th>
            <Th>Joined</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u) => {
            const name = fullName(u)
            const active = u.id === activeId
            return (
              <tr
                key={u.id}
                onClick={() => onOpen(u.id)}
                className={cn('cursor-pointer transition-colors hover:bg-rygn-surface', active && 'bg-rygn-blue/5')}
              >
                <Td className="pr-0">
                  <input
                    type="checkbox"
                    className={checkboxClass}
                    checked={selectedIds.has(u.id)}
                    onChange={() => onToggle(u.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${name}`}
                  />
                </Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={name} tone={active ? 'navy' : 'light'} />
                    <div className="min-w-0">
                      <p className="font-semibold text-rygn-navy">{name}</p>
                      <p className="text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </Td>
                <Td className="text-gray-600">{roleLabel(u)}</Td>
                <Td>
                  <StatusBadge status={STATUS_LABELS[u.status]} />
                </Td>
                <Td className="whitespace-nowrap text-gray-600">{formatDate(u.lastLoginAt, 'Never')}</Td>
                <Td className="whitespace-nowrap text-gray-600">{formatDate(u.createdAt)}</Td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
