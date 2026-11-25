'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, Search } from 'lucide-react'
import { Button } from '@/components/brand/button'
import { SelectInput, TextInput } from '@/components/brand/form'
import { PageHeader } from '@/components/dashboard/page-header'
import { InviteUserDialog } from '@/components/dashboard/users/invite-user-dialog'
import { UserDetails } from '@/components/dashboard/users/user-details'
import { UserTable } from '@/components/dashboard/users/user-table'
import { useCan } from '@/hooks/use-auth'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useUpdateUserStatus, useUserCounts, useUsers, type UserCounts } from '@/hooks/use-users'
import type { ManageableStatus } from '@/lib/api/users'
import { ROLE_OPTIONS, STATUS_LABELS, USER_STATUSES } from '@/lib/users'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import type { UserRole, UserStatus } from '@/store/types'

const PAGE_SIZE = 10

type Tab = keyof UserCounts
const TABS: { key: Tab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  ...USER_STATUSES.map((s) => ({ key: s, label: STATUS_LABELS[s] })),
]
const isTab = (value: string | null): value is Tab => TABS.some((t) => t.key === value)

function UsersView() {
  const me = useAuthStore((s) => s.user)
  const tabParam = useSearchParams().get('tab')

  const [tab, setTab] = useState<Tab>(isTab(tabParam) ? tabParam : 'ALL')
  const [role, setRole] = useState<UserRole | ''>('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [activeId, setActiveId] = useState<string>()

  const debouncedSearch = useDebouncedValue(search)
  const { data, error, isPending, isFetching, refetch } = useUsers({
    page,
    limit: PAGE_SIZE,
    status: tab === 'ALL' ? undefined : (tab as UserStatus),
    role: role || undefined,
    search: debouncedSearch || undefined,
  })
  const counts = useUserCounts().data
  const updateStatus = useUpdateUserStatus()
  const canUpdate = useCan('user:update')
  const canInvite = useCan('user:invite')

  const users = data?.items ?? []
  const meta = data?.meta
  const active = users.find((u) => u.id === activeId) ?? users[0]

  /** Any filter change starts again from page 1 with nothing selected. */
  const resetPaging = () => {
    setPage(1)
    setSelectedIds(new Set())
  }

  const toggle = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })
  const toggleAll = () =>
    setSelectedIds((prev) => (users.every((u) => prev.has(u.id)) ? new Set() : new Set(users.map((u) => u.id))))

  const bulkSetStatus = (status: ManageableStatus) =>
    updateStatus.mutate(
      // The backend never lets you change your own status.
      { ids: [...selectedIds].filter((id) => id !== me?.id), status },
      { onSuccess: () => setSelectedIds(new Set()) },
    )

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage roles and access for everyone with a RYGN dashboard account."
        actions={canInvite && <InviteUserDialog />}
      />

      <div role="tablist" aria-label="User status" className="mb-6 flex gap-2 overflow-x-auto overflow-y-hidden border-b border-gray-200">
        {TABS.map((t) => {
          const selected = t.key === tab
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setTab(t.key)
                resetPaging()
              }}
              className={cn(
                '-mb-px flex shrink-0 items-center gap-2 border-b-[3px] px-4 py-3 font-semibold transition-colors',
                selected ? 'border-rygn-blue text-rygn-navy' : 'border-transparent text-gray-600 hover:text-rygn-navy',
              )}
            >
              {t.label}
              {counts && (
                <span className={cn('rounded-full px-2 py-0.5 text-xs', selected ? 'bg-rygn-navy text-white' : 'bg-gray-100 text-gray-600')}>
                  {counts[t.key]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex flex-wrap items-center gap-3 p-6">
            <TextInput
              type="search"
              icon={Search}
              size="md"
              placeholder="Name or email"
              aria-label="Search users"
              maxLength={100}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                resetPaging()
              }}
              className="min-w-56 flex-1"
            />
            <SelectInput
              size="md"
              options={ROLE_OPTIONS}
              placeholder="All roles"
              aria-label="Role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value as UserRole | '')
                resetPaging()
              }}
            />
            {isFetching && !isPending && <Loader2 className="h-5 w-5 animate-spin text-rygn-blue" aria-label="Updating" />}
          </div>

          {canUpdate && selectedIds.size > 0 && (
            <div className="flex flex-wrap items-center gap-3 bg-rygn-blue/10 px-6 py-3">
              <span className="font-semibold">{selectedIds.size} selected</span>
              <Button variant="success" size="sm" disabled={updateStatus.isPending} onClick={() => bulkSetStatus('ACTIVE')}>
                Reactivate
              </Button>
              <Button variant="ghostDanger" size="sm" disabled={updateStatus.isPending} onClick={() => bulkSetStatus('SUSPENDED')}>
                Suspend
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
                Clear
              </Button>
            </div>
          )}

          {isPending ? (
            <div className="flex justify-center py-16" role="status" aria-label="Loading users">
              <Loader2 className="h-8 w-8 animate-spin text-rygn-blue" />
            </div>
          ) : error ? (
            <div className="px-6 py-16 text-center">
              <p className="font-semibold">
                {error.status === 403 ? 'You don’t have permission to view users.' : 'Couldn’t load users.'}
              </p>
              <p className="mt-1 text-sm text-gray-600">{error.message}</p>
              {error.status !== 403 && (
                <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
                  Try again
                </Button>
              )}
            </div>
          ) : users.length === 0 ? (
            <p className="px-6 py-16 text-center text-sm text-gray-500">No users match your filters.</p>
          ) : (
            <UserTable
              users={users}
              selectedIds={selectedIds}
              activeId={active?.id}
              onToggle={toggle}
              onToggleAll={toggleAll}
              onOpen={setActiveId}
            />
          )}

          {meta && meta.total > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-6 py-4 text-sm">
              <span className="text-gray-600">
                Showing {(meta.page - 1) * meta.limit + 1}–{(meta.page - 1) * meta.limit + users.length} of {meta.total} users
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={meta.page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Prev
                </Button>
                <span className="px-2 text-gray-600">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <Button variant="outline" size="sm" disabled={meta.page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </section>

        {active && <UserDetails key={active.id} user={active} isSelf={active.id === me?.id} />}
      </div>
    </>
  )
}

export default function UsersPage() {
  // Editors don't have user:read (the nav hides this page; this covers a typed URL).
  if (!useCan('user:read')) {
    return (
      <>
        <PageHeader title="Users" description="Manage roles and access for everyone with a RYGN dashboard account." />
        <p className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center font-semibold">
          You don’t have permission to view users.
        </p>
      </>
    )
  }
  // useSearchParams (?tab=) needs a Suspense boundary.
  return (
    <Suspense>
      <UsersView />
    </Suspense>
  )
}
