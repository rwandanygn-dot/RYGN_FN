import { Pencil } from 'lucide-react'
import { StatusBadge } from '@/components/brand/badge'
import { Button } from '@/components/brand/button'
import type { Post } from '@/lib/dashboard/sample-data'
import { Td, Th } from './panel'

/** Events & news table. The dashboard shows a compact version; the Events page adds visibility + edit. */
export function PostsTable({ posts, full = false }: { posts: Post[]; full?: boolean }) {
  if (posts.length === 0) {
    return <p className="px-6 py-12 text-center text-sm text-gray-500">No posts match your filters.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="border-b border-gray-200">
          <tr>
            <Th>Title</Th>
            <Th>Type</Th>
            <Th>Author</Th>
            {full && <Th>Visibility</Th>}
            <Th>Status</Th>
            <Th>Updated</Th>
            {full && <Th className="sr-only">Actions</Th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-rygn-surface/60">
              <Td className="font-semibold text-rygn-navy">{post.title}</Td>
              <Td className="text-gray-600">{post.type}</Td>
              <Td className="whitespace-nowrap text-gray-600">{post.author}</Td>
              {full && <Td className="whitespace-nowrap text-gray-600">{post.visibility}</Td>}
              <Td>
                <StatusBadge status={post.status} />
              </Td>
              <Td className="whitespace-nowrap text-gray-600">{post.updated}</Td>
              {full && (
                <Td className="text-right">
                  <Button variant="outline" size="sm" aria-label={`Edit ${post.title}`}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </Td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
