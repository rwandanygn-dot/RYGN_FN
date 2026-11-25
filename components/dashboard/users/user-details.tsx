'use client'

import { useState } from 'react'
import { Avatar } from '@/components/brand/avatar'
import { StatusBadge } from '@/components/brand/badge'
import { Button } from '@/components/brand/button'
import { SelectInput } from '@/components/brand/form'
import { useCan } from '@/hooks/use-auth'
import {
  useDeleteUser,
  useRevokeUserSessions,
  useSendPasswordReset,
  useUpdateUserRole,
  useUpdateUserStatus,
} from '@/hooks/use-users'
import type { User } from '@/lib/api/users'
import { ROLE_OPTIONS, STATUS_LABELS, formatDate, fullName } from '@/lib/users'
import type { UserRole } from '@/store/types'

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  )
}

/** Role, status, reset password and sign-out controls (user:update). */
function ManageUser({ user }: { user: User }) {
  const [role, setRole] = useState<UserRole>(user.role)
  const updateRole = useUpdateUserRole()
  const updateStatus = useUpdateUserStatus()
  const sendReset = useSendPasswordReset()
  const revokeSessions = useRevokeUserSessions()
  const suspended = user.status === 'SUSPENDED'

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="user-role" className="mb-3 block font-semibold">
          Role & permissions
        </label>
        <SelectInput id="user-role" options={ROLE_OPTIONS} value={role} onChange={(e) => setRole(e.target.value as UserRole)} />
      </div>

      {user.status === 'PENDING' && (
        <p className="rounded-lg bg-rygn-yellow/15 px-4 py-3 text-sm text-rygn-yellow-dark">
          Waiting for this user to verify their email. They become active automatically once they do.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button onClick={() => updateRole.mutate({ id: user.id, role })} disabled={role === user.role || updateRole.isPending}>
          {updateRole.isPending ? 'Saving…' : 'Save changes'}
        </Button>
        <Button variant="outline" onClick={() => sendReset.mutate(user.email)} disabled={sendReset.isPending}>
          {sendReset.isPending ? 'Sending…' : 'Reset password'}
        </Button>
        <Button variant="outline" className="col-span-2" onClick={() => revokeSessions.mutate(user.id)} disabled={revokeSessions.isPending}>
          {revokeSessions.isPending ? 'Signing out…' : 'Sign out of all devices'}
        </Button>
        {user.status !== 'PENDING' && (
          <Button
            variant={suspended ? 'success' : 'danger'}
            className="col-span-2"
            onClick={() => updateStatus.mutate({ ids: [user.id], status: suspended ? 'ACTIVE' : 'SUSPENDED' })}
            disabled={updateStatus.isPending}
          >
            {suspended ? 'Reactivate account' : 'Suspend account'}
          </Button>
        )}
      </div>
    </div>
  )
}

/** Soft delete with an inline "are you sure?" step (user:delete). */
function DeleteUser({ user }: { user: User }) {
  const remove = useDeleteUser()
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <Button variant="ghostDanger" className="w-full" onClick={() => setConfirming(true)}>
        Delete user
      </Button>
    )
  }
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p>Delete {fullName(user)}? They lose access immediately.</p>
      <div className="mt-3 flex gap-2">
        <Button variant="danger" size="sm" disabled={remove.isPending} onClick={() => remove.mutate(user.id)}>
          {remove.isPending ? 'Deleting…' : 'Yes, delete'}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    </div>
  )
}

/**
 * Side panel for the selected user. Re-mount it per user (`key={user.id}`) so the
 * role dropdown starts from that user's role. Controls follow the viewer's permissions.
 */
export function UserDetails({ user, isSelf }: { user: User; isSelf: boolean }) {
  const canUpdate = useCan('user:update')
  const canDelete = useCan('user:delete')
  const name = fullName(user)

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-6" aria-label={`${name} details`}>
      <div className="flex flex-col items-center border-b border-gray-200 pb-6 text-center">
        <Avatar name={name} tone="navy" size="xl" />
        <h2 className="font-heading mt-4 text-2xl font-bold">{name}</h2>
        <p className="mb-3 break-all text-gray-500">{user.email}</p>
        <StatusBadge status={STATUS_LABELS[user.status]} />
      </div>

      <dl className="grid grid-cols-2 gap-4 py-6">
        <Detail label="Joined" value={formatDate(user.createdAt)} />
        <Detail label="Last login" value={formatDate(user.lastLoginAt, 'Never')} />
        <Detail label="Email verified" value={formatDate(user.emailVerifiedAt, 'Not yet')} />
      </dl>

      {isSelf ? (
        <p className="rounded-lg bg-rygn-surface px-4 py-3 text-sm text-gray-600">
          This is your account. Edit your name and password in My account; another administrator must change your role or status.
        </p>
      ) : (
        <div className="space-y-3">
          {canUpdate && <ManageUser user={user} />}
          {canDelete && <DeleteUser user={user} />}
        </div>
      )}
    </aside>
  )
}
