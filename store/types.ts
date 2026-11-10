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
