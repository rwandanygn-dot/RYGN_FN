import { create } from 'zustand';
import type { NavigationStore } from './types';

export const useNavigationStore = create<NavigationStore>()((set) => ({
  isMobileMenuOpen: false,

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
