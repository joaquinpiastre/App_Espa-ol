import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { STORAGE_KEYS } from "../constants/storageKeys";
import type { AuthSession, AuthUser } from "../types/auth";

type AuthState = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  signIn: (user: AuthUser, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isAuthenticated: false,
      rememberMe: false,
      signIn: async (user, rememberMe) => {
        const createdAt = Date.now();
        const nextSession: AuthSession = { user, createdAt };
        set({
          session: nextSession,
          isAuthenticated: true,
          rememberMe,
        });
      },
      signOut: async () => {
        set({ session: null, isAuthenticated: false, rememberMe: false });
      },
    }),
    {
      name: STORAGE_KEYS.authSession,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        rememberMe: s.rememberMe,
        session: s.rememberMe ? s.session : null,
        isAuthenticated: s.rememberMe ? s.isAuthenticated : false,
      }),
    }
  )
);

// Hook auxiliar para leer el usuario actual.
export function useCurrentUser() {
  const session = useAuthStore((s) => s.session);
  return session?.user ?? null;
}

