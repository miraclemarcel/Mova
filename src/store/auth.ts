import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type AuthState = {
  phone: string;
  user: User | null;
  hasHydrated: boolean;
  setPhone: (phone: string) => void;
  sendCode: () => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
  completeProfile: (profile: Omit<User, 'phone'>) => void;
  signOut: () => void;
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      phone: '',
      user: null,
      hasHydrated: false,
      setPhone: (phone) => set({ phone }),
      // UI-only mocks: swap these for real API calls later.
      sendCode: () => wait(700),
      verifyCode: async (code) => {
        await wait(900);
        return code.length === 4;
      },
      completeProfile: (profile) => set({ user: { ...profile, phone: get().phone } }),
      signOut: () => set({ user: null, phone: '' }),
    }),
    {
      name: 'mova-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ phone, user }) => ({ phone, user }),
      onRehydrateStorage: () => () => useAuthStore.setState({ hasHydrated: true }),
    },
  ),
);
