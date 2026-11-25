import { create } from 'zustand';
import { submitToFormspree } from '@/lib/formspree';
import type { NewsletterState, NewsletterStore } from './types';

const SUCCESS_MESSAGE_MS = 5000;

// Bumped on every submit and reset so a request that finishes after the
// user has left the page (and the store was reset) is ignored.
let requestId = 0;
let successTimer: ReturnType<typeof setTimeout> | undefined;

const initialState: NewsletterState = {
  email: '',
  isSubmitting: false,
  isSubmitted: false,
  error: null,
};

export const useNewsletterStore = create<NewsletterStore>()((set, get) => ({
  ...initialState,

  setEmail: (email) => set({ email }),

  subscribe: async () => {
    const { email, isSubmitting } = get();
    if (!email || isSubmitting) return;

    const id = ++requestId;
    set({ error: null, isSubmitting: true });

    const result = await submitToFormspree('Newsletter', { email });
    if (id !== requestId) return;

    if (!result.ok) {
      set({ isSubmitting: false, error: result.error });
      return;
    }

    set({ isSubmitting: false, isSubmitted: true, email: '' });
    clearTimeout(successTimer);
    successTimer = setTimeout(() => set({ isSubmitted: false }), SUCCESS_MESSAGE_MS);
  },

  reset: () => {
    requestId++;
    clearTimeout(successTimer);
    set(initialState);
  },
}));
