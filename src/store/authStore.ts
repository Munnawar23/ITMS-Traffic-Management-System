import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  token: string | null;
  user: any | null;
  language: string;
  setAuth: (token: string | null, user: any | null) => void;
  setLanguage: (lang: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      language: "en",
      setAuth: (token, user) => set({ token, user }),
      setLanguage: (language) => set({ language }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "itms-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
