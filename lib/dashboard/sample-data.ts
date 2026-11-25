/**
 * Static sample data for dashboard sections that have no backend yet
 * (events & news, signups chart, categories, messages). Users come from the API.
 */

// ---------- Events & news ----------

export const POST_STATUSES = ['Draft', 'In review', 'Scheduled', 'Published'] as const
export type PostStatus = (typeof POST_STATUSES)[number]
export type PostType = 'News' | 'Event'

export interface Post {
  id: string
  title: string
  type: PostType
  author: string
  visibility: 'Public' | 'Members only'
  status: PostStatus
  updated: string
}

export const POSTS: Post[] = [
  { id: 'p1', title: 'Why Rwanda is exploring nuclear energy: a youth perspective', type: 'News', author: 'Yves Emeka', visibility: 'Public', status: 'Published', updated: '2 h ago' },
  { id: 'p2', title: 'Introduction to Radiation Protection — workshop', type: 'Event', author: 'Yves Emeka', visibility: 'Public', status: 'Scheduled', updated: 'Publishes 1 Dec' },
  { id: 'p3', title: 'Five career paths in nuclear science for Rwandan graduates', type: 'News', author: 'Yves Emeka', visibility: 'Public', status: 'In review', updated: 'Yesterday' },
  { id: 'p4', title: 'Women in Nuclear: Networking Evening', type: 'Event', author: 'Yves Emeka', visibility: 'Members only', status: 'Published', updated: '3 days ago' },
  { id: 'p5', title: 'Small modular reactors explained in plain language', type: 'News', author: 'Yves Emeka', visibility: 'Public', status: 'Draft', updated: '4 days ago' },
  { id: 'p6', title: 'How nuclear medicine is improving cancer care in Rwanda', type: 'News', author: 'Yves Emeka', visibility: 'Public', status: 'Published', updated: '1 week ago' },
  { id: 'p7', title: 'RYGN Annual General Meeting 2027', type: 'Event', author: 'Yves Emeka', visibility: 'Members only', status: 'Draft', updated: '2 weeks ago' },
]

export interface UpcomingEvent {
  id: string
  month: string
  day: string
  title: string
  details: string
}

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  { id: 'e1', month: 'DEC', day: '03', title: 'Introduction to Radiation Protection', details: 'Workshop · Kigali · 42 registered' },
  { id: 'e2', month: 'DEC', day: '12', title: 'Women in Nuclear: Networking Evening', details: 'Networking · Kigali · 67 registered' },
  { id: 'e3', month: 'JAN', day: '20', title: 'RYGN Annual General Meeting 2027', details: 'AGM · Kigali · RSVPs open' },
]

// ---------- Overview ----------

export const OVERVIEW_STATS = {
  upcomingEvents: { value: UPCOMING_EVENTS.length, note: 'Next: 3 Dec' },
  newsPublished: { value: 14, note: 'This month · 1 in review' },
}

export const MONTHLY_SIGNUPS = [
  { month: 'Jun', count: 22 },
  { month: 'Jul', count: 31 },
  { month: 'Aug', count: 18 },
  { month: 'Sep', count: 44 },
  { month: 'Oct', count: 35 },
  { month: 'Nov', count: 38 },
]

export const USERS_BY_CATEGORY: { category: string; percent: number }[] = [
  { category: 'Student', percent: 52 },
  { category: 'Young professional', percent: 31 },
  { category: 'Researcher', percent: 11 },
  { category: 'Supporter / alumni', percent: 6 },
]

export const UNREAD_MESSAGES = 3
