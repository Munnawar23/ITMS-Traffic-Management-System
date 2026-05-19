import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeState {
  themeMode: "system" | "light" | "dark";
  setThemeMode: (mode: "system" | "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeMode: "system",
      setThemeMode: (mode) => {
        console.log(`[🎨 THEME STORE] Action: setThemeMode("${mode}") called.`);
        set({ themeMode: mode });
      },
    }),
    {
      name: "itms-theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
