import { create } from 'zustand';
import { submitToFormspree } from '@/lib/formspree';
import type {
  InterestArea,
  InvolvementFormData,
  InvolvementState,
  InvolvementStore,
} from './types';

const SUCCESS_MESSAGE_MS = 5000;

// Bumped on every submit and reset so a request that finishes after the
// user has left the page (and the store was reset) is ignored.
let requestId = 0;
let successTimer: ReturnType<typeof setTimeout> | undefined;

export const INTEREST_OPTIONS: InterestArea[] = [
  'Join our network',
  'Get mentorship',
  'Participate in programs',
  'Make an impact',
];

const emptyFormData: InvolvementFormData = {
  fullName: '',
  email: '',
  phone: '',
  interestAreas: [],
  message: '',
};

const initialState: InvolvementState = {
  formData: emptyFormData,
  isSubmitting: false,
  isSubmitted: false,
  error: null,
};

export const useInvolvementStore = create<InvolvementStore>()((set, get) => ({
  ...initialState,

  setField: (field, value) =>
    set((state) => ({ formData: { ...state.formData, [field]: value } })),

  toggleInterestArea: (area) =>
    set((state) => {
      const { interestAreas } = state.formData;
      return {
        formData: {
          ...state.formData,
          interestAreas: interestAreas.includes(area)
            ? interestAreas.filter((item) => item !== area)
            : [...interestAreas, area],
        },
      };
    }),

  submit: async () => {
    const { formData, isSubmitting } = get();
    if (isSubmitting) return;

    const id = ++requestId;
    set({ error: null, isSubmitting: true });

    const result = await submitToFormspree('Get Involved', {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      interestAreas:
        formData.interestAreas.length > 0
          ? formData.interestAreas.join(', ')
          : 'None selected',
      message: formData.message || 'No message',
    });
    if (id !== requestId) return;

    if (!result.ok) {
      set({ isSubmitting: false, error: result.error });
      return;
    }

    set({ isSubmitting: false, isSubmitted: true, formData: emptyFormData });
    clearTimeout(successTimer);
    successTimer = setTimeout(() => set({ isSubmitted: false }), SUCCESS_MESSAGE_MS);
  },

  reset: () => {
    requestId++;
    clearTimeout(successTimer);
    set(initialState);
  },
}));
