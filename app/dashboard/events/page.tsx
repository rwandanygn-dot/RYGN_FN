'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { DOT_TONE, STATUS_TONE } from '@/components/brand/badge'
import { Button } from '@/components/brand/button'
import { TextInput } from '@/components/brand/form'
import { PageHeader } from '@/components/dashboard/page-header'
import { PostsTable } from '@/components/dashboard/posts-table'
import { POST_STATUSES, POSTS, type PostType } from '@/lib/dashboard/sample-data'
import { cn } from '@/lib/utils'

const TYPE_FILTERS: { label: string; type?: PostType }[] = [
  { label: 'All' },
  { label: 'News', type: 'News' },
  { label: 'Events', type: 'Event' },
]

export default function EventsNewsPage() {
  const [typeFilter, setTypeFilter] = useState<PostType | undefined>()
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const posts = POSTS.filter((p) => (!typeFilter || p.type === typeFilter) && (!q || p.title.toLowerCase().includes(q)))

  return (
    <>
      <PageHeader
        title="Events & News"
        description="Create, schedule and publish RYGN events and news to the website and member portal."
        actions={
          <Button>
            <Plus className="h-5 w-5" />
            New post
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {POST_STATUSES.map((status) => (
          <div key={status} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-5">
            <span className={cn('h-2.5 w-2.5 rounded-full', DOT_TONE[STATUS_TONE[status]])} />
            <span className="flex-1 font-medium text-gray-600">{status === 'Draft' ? 'Drafts' : status}</span>
            <span className="font-heading text-2xl font-extrabold">{POSTS.filter((p) => p.status === status).length}</span>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 p-6">
          <div className="flex gap-2" role="group" aria-label="Filter by type">
            {TYPE_FILTERS.map((f) => {
              const active = typeFilter === f.type
              return (
                <button
                  key={f.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTypeFilter(f.type)}
                  className={cn(
                    'rounded-full px-5 py-2.5 text-sm font-semibold transition',
                    active ? 'bg-rygn-green text-white' : 'border border-gray-200 hover:bg-gray-50',
                  )}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
          <TextInput
            type="search"
            size="md"
            placeholder="Search titles..."
            aria-label="Search titles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-72"
          />
        </div>
        <PostsTable posts={posts} full />
      </section>
    </>
  )
}
