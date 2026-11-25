'use client'

import { useState, type FormEvent } from 'react'
import { Mail, Plus } from 'lucide-react'
import { emailError } from '@/components/auth/password-rules'
import { Button } from '@/components/brand/button'
import { Field, SelectInput, TextInput } from '@/components/brand/form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useInviteUser } from '@/hooks/use-users'
import { ROLE_OPTIONS } from '@/lib/users'
import type { UserRole } from '@/store/types'

/** POST /invitations { email, role }. The invitee gets a link to /accept-invitation. */
export function InviteUserDialog() {
  const invite = useInviteUser()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('EDITOR')
  const [error, setError] = useState<string>()

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setEmail('')
      setRole('EDITOR')
      setError(undefined)
    }
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = emailError(email)
    setError(e)
    if (e) return
    invite.mutate(
      { email: email.trim().toLowerCase(), role },
      { onSuccess: () => onOpenChange(false), onError: (err) => setError(err.fieldErrors.email) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-5 w-5" />
          Invite user
        </Button>
      </DialogTrigger>
      <DialogContent className="font-ui bg-white text-rygn-navy sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-bold">Invite a user</DialogTitle>
          <DialogDescription className="text-gray-600">They’ll get an email with a link to set up their account.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field label="Email" htmlFor="invite-email" error={error}>
            <TextInput
              id="invite-email"
              type="email"
              icon={Mail}
              size="md"
              maxLength={254}
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              showError={false}
            />
          </Field>
          <Field label="Role" htmlFor="invite-role">
            <SelectInput id="invite-role" size="md" options={ROLE_OPTIONS} value={role} onChange={(e) => setRole(e.target.value as UserRole)} />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={invite.isPending}>
              {invite.isPending ? 'Sending…' : 'Send invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
