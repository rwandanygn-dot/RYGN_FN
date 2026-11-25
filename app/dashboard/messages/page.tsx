import { MessageSquare } from 'lucide-react'
import { Panel } from '@/components/dashboard/panel'
import { PageHeader } from '@/components/dashboard/page-header'

export default function MessagesPage() {
  return (
    <>
      <PageHeader title="Messages" description="Conversations with members and website visitors." />
      <Panel className="flex flex-col items-center py-16 text-center">
        <span className="mb-4 rounded-2xl bg-rygn-blue/10 p-4 text-rygn-blue-dark">
          <MessageSquare className="h-8 w-8" />
        </span>
        <p className="font-heading text-lg font-bold">Messages are coming soon</p>
        <p className="mt-2 max-w-sm text-sm text-gray-600">This page has no design yet. Share one and it will be built here.</p>
      </Panel>
    </>
  )
}
