import { create } from 'zustand';
import { EMAIL_RE, passwordError } from '@/components/auth/password-rules';
import type { RegisterErrors, RegisterFormData, RegisterState, RegisterStep, RegisterStore } from './types';

export const REGISTER_STEPS = [
  { step: 1, title: 'Account', description: 'Name, email & password' },
  { step: 2, title: 'Profile', description: 'Studies, work & location' },
  { step: 3, title: 'Interests', description: 'Topics & consent' },
] as const;

const LAST_STEP = REGISTER_STEPS.length as RegisterStep;

/** Rwandan mobile number: 9 digits starting with 7 (after +250). */
const RW_PHONE_RE = /^7\d{8}$/;

const emptyFormData: RegisterFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  category: '',
  institution: '',
  fieldOfStudy: '',
  province: '',
  interests: [],
  acceptTerms: false,
  newsletter: true,
};

const initialState: RegisterState = {
  step: 1,
  formData: emptyFormData,
  errors: {},
  isSubmitting: false,
  isSubmitted: false,
  error: null,
};

const required = (value: string, message: string) => (value.trim() ? undefined : message);

const STEP_VALIDATORS: Record<RegisterStep, (d: RegisterFormData) => RegisterErrors> = {
  1: (d) => ({
    firstName: required(d.firstName, 'First name is required'),
    lastName: required(d.lastName, 'Last name is required'),
    email: !d.email.trim() ? 'Email is required' : EMAIL_RE.test(d.email.trim()) ? undefined : 'Invalid email address',
    phone: !d.phone.trim()
      ? 'Phone number is required'
      : RW_PHONE_RE.test(d.phone.replace(/\s/g, ''))
        ? undefined
        : 'Enter a valid number, e.g. 788 123 456',
    password: passwordError(d.password),
    confirmPassword: !d.confirmPassword
      ? 'Please confirm your password'
      : d.confirmPassword === d.password
        ? undefined
        : 'Passwords do not match',
  }),
  2: (d) => ({
    category: required(d.category, 'Choose a category'),
    institution: required(d.institution, 'Institution or employer is required'),
    province: required(d.province, 'Choose a province'),
  }),
  3: (d) => ({
    interests: d.interests.length ? undefined : 'Pick at least one topic',
    acceptTerms: d.acceptTerms ? undefined : 'You must accept the terms to continue',
  }),
};

/** Drops fields without an error so `Object.keys(errors).length` means "has errors". */
function validateStep(step: RegisterStep, data: RegisterFormData): RegisterErrors {
  return Object.fromEntries(Object.entries(STEP_VALIDATORS[step](data)).filter(([, v]) => v)) as RegisterErrors;
}

export const useRegisterStore = create<RegisterStore>()((set, get) => ({
  ...initialState,

  setField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
      errors: { ...state.errors, [field]: undefined },
    })),

  toggleInterest: (topic) =>
    set((state) => {
      const { interests } = state.formData;
      return {
        formData: {
          ...state.formData,
          interests: interests.includes(topic) ? interests.filter((t) => t !== topic) : [...interests, topic],
        },
        errors: { ...state.errors, interests: undefined },
      };
    }),

  next: () => {
    const { step, formData } = get();
    const errors = validateStep(step, formData);
    set({ errors });
    if (Object.keys(errors).length) return;

    if (step < LAST_STEP) {
      set({ step: (step + 1) as RegisterStep });
      return;
    }
    // TODO: integrate with the backend (member sign-up endpoint not built yet)
    const { confirmPassword: _confirm, ...payload } = formData;
    console.log('register', { ...payload, phone: `+250${formData.phone.replace(/\s/g, '')}` });
    set({ isSubmitted: true });
  },

  back: () => set((state) => ({ step: Math.max(1, state.step - 1) as RegisterStep, errors: {} })),

  reset: () => set(initialState),
}));
