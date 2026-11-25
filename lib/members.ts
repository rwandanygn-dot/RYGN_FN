/** Member profile vocabulary (register form, sample dashboard data). Roles/statuses: see lib/users. */

export const MEMBER_CATEGORIES = ['Student', 'Young professional', 'Researcher', 'Supporter / alumni'] as const
export type MemberCategory = (typeof MEMBER_CATEGORIES)[number]

export const PROVINCES = ['Kigali', 'Northern', 'Southern', 'Eastern', 'Western'] as const
export type Province = (typeof PROVINCES)[number]

export const INTEREST_TOPICS = [
  'Nuclear energy',
  'Nuclear medicine',
  'Radiation safety',
  'Research',
  'Policy & regulation',
  'Careers',
  'Mentorship',
  'Events & workshops',
] as const
export type InterestTopic = (typeof INTEREST_TOPICS)[number]
