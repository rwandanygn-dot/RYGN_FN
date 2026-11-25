import { Panel } from '@/components/dashboard/panel'
import { PageHeader } from '@/components/dashboard/page-header'
import { PostsTable } from '@/components/dashboard/posts-table'
import {
  OverviewStats,
  PendingApprovals,
  QuickActions,
  SignupsChart,
  UpcomingEvents,
  UsersByCategory,
} from '@/components/dashboard/overview'
import { POSTS } from '@/lib/dashboard/sample-data'

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        description="What’s happening across RYGN this month."
        actions={
          <span className="rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs font-medium text-gray-600">
            Users are live · events &amp; charts are sample data
          </span>
        }
      />

      <OverviewStats />

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <SignupsChart />
        <QuickActions />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <PendingApprovals />
        <UpcomingEvents />
        <UsersByCategory />
      </div>

      <Panel title="Recent events & news" action={{ label: 'Open Events & News', href: '/dashboard/events' }} flush className="mt-6 pb-2">
        <PostsTable posts={POSTS.slice(0, 4)} />
      </Panel>
    </>
  )
}
