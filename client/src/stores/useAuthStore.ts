import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthUser {
  id: string;
  username: string;
  email: string;
}

interface AuthStoreState {
  user: AuthUser | null;
  token: string | null;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user: AuthUser | null) => set({ user }),
      setToken: (token: string | null) => set({ token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // persist only user and token
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export default useAuthStore;