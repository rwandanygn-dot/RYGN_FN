import { create } from 'zustand';
import { submitToFormspree } from '@/lib/formspree';
import type { DonationState, DonationStore, DonationTier } from './types';

/** Price in USD for each partnership tier. */
export const DONATION_TIER_PRICES: Record<DonationTier, number> = {
  Silver: 15,
  Gold: 20,
  Platinum: 25,
  Diamond: 30,
};

// Bumped on every submit and reset so a request that finishes after the
// user has left the page (and the store was reset) is ignored.
let requestId = 0;

const initialState: DonationState = {
  email: '',
  selectedTier: 'Diamond',
  isSubmitting: false,
  isSubmitted: false,
  error: null,
};

export const useDonationStore = create<DonationStore>()((set, get) => ({
  ...initialState,

  setEmail: (email) => set({ email }),
  selectTier: (selectedTier) => set({ selectedTier }),

  submitPledge: async () => {
    const { email, selectedTier, isSubmitting } = get();
    if (isSubmitting) return;

    const id = ++requestId;
    set({ error: null, isSubmitting: true });

    const result = await submitToFormspree('Donation Pledge', {
      email,
      pledgedTier: selectedTier,
      amount: `$${DONATION_TIER_PRICES[selectedTier]}`,
    });
    if (id !== requestId) return;

    if (!result.ok) {
      set({ isSubmitting: false, error: result.error });
      return;
    }

    set({ isSubmitting: false, isSubmitted: true });
  },

  // Keeps the selected tier, matching the "Send Another Pledge" button.
  reset: () => {
    requestId++;
    set({ email: '', isSubmitting: false, isSubmitted: false, error: null });
  },
}));
