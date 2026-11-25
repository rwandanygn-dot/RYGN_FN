import { Bell, Menu, Plus, Search } from 'lucide-react'
import { Button } from '@/components/brand/button'
import { TextInput } from '@/components/brand/form'

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-8">
      <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={onOpenMenu}>
        <Menu className="h-5 w-5" />
      </Button>

      <TextInput
        type="search"
        icon={Search}
        size="md"
        placeholder="Search users, events, news..."
        aria-label="Search"
        className="w-full max-w-md"
        controlClassName="bg-rygn-surface"
      />

      <div className="ml-auto flex items-center gap-3">
        <Button variant="outline" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <Button variant="accent">
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Create</span>
        </Button>
      </div>
    </header>
  )
}
