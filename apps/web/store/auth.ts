import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  plan: 'FREE' | 'PREMIUM' | 'PRO';
  organizationId?: string;
  orgRole?: 'SUPER_ADMIN' | 'ORG_ADMIN' | 'TEACHER' | 'MEMBER' | 'VIEWER';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'hsk-auth-storage', // saves to localStorage
    }
  )
);
