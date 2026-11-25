/** Shared status fields for any store that submits a form. */
export interface SubmissionState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

// ---------- Navigation ----------

export interface NavigationState {
  isMobileMenuOpen: boolean;
}

export interface NavigationActions {
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export type NavigationStore = NavigationState & NavigationActions;

// ---------- Newsletter ----------

export interface NewsletterState extends SubmissionState {
  email: string;
}

export interface NewsletterActions {
  setEmail: (email: string) => void;
  subscribe: () => Promise<void>;
  reset: () => void;
}

export type NewsletterStore = NewsletterState & NewsletterActions;

// ---------- Get Involved ----------

export type InterestArea =
  | 'Join our network'
  | 'Get mentorship'
  | 'Participate in programs'
  | 'Make an impact';

export interface InvolvementFormData {
  fullName: string;
  email: string;
  phone: string;
  interestAreas: InterestArea[];
  message: string;
}

export type InvolvementTextField = Exclude<keyof InvolvementFormData, 'interestAreas'>;

export interface InvolvementState extends SubmissionState {
  formData: InvolvementFormData;
}

export interface InvolvementActions {
  setField: (field: InvolvementTextField, value: string) => void;
  toggleInterestArea: (area: InterestArea) => void;
  submit: () => Promise<void>;
  reset: () => void;
}

export type InvolvementStore = InvolvementState & InvolvementActions;

// ---------- Donation ----------

export type DonationTier = 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface DonationState extends SubmissionState {
  email: string;
  selectedTier: DonationTier;
}

export interface DonationActions {
  setEmail: (email: string) => void;
  selectTier: (tier: DonationTier) => void;
  submitPledge: () => Promise<void>;
  reset: () => void;
}

export type DonationStore = DonationState & DonationActions;

// ---------- Auth ----------

export type UserRole = 'ADMIN' | 'EDITOR';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';

/** Public user shape returned by the API (rygn_be publicUserSelect). */
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

/** Permission keys from rygn_be src/config/permissions.ts ("<resource>:<action>"). */
export type Permission =
  | 'content:create'
  | 'content:read'
  | 'content:update'
  | 'content:delete'
  | 'content:publish'
  | 'user:read'
  | 'user:update'
  | 'user:delete'
  | 'user:invite'
  | 'role:manage'
  | 'audit:read';

/** The signed-in user (GET /auth/me): the public user plus their role's permissions. */
export interface CurrentUser extends AuthUser {
  permissions: Permission[];
}

export interface AuthState {
  user: CurrentUser | null;
  accessToken: string | null;
}

export interface AuthActions {
  setSession: (user: CurrentUser, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: CurrentUser) => void;
  clearSession: () => void;
}

export type AuthStore = AuthState & AuthActions;
