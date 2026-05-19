import { useColorScheme } from "react-native";
import { useThemeStore } from "@/store/useThemeStore";

export const lightColors = {
  background: "#F4F5F7",
  card: "#FFFFFF",
  text: "#000000",
  subtext: "#000000",
  primary: "#1E40AF",
  accent: "#6C63FF",
  border: "#E2E8F0",
};

export const darkColors = {
  background: "#0F172A", // Soft gray-dark slate (Slate-900)
  card: "#1E293B",       // Slate-800
  text: "#FFFFFF",       // Clean high-contrast white text
  subtext: "#FFFFFF",    // Clean high-contrast white subtext
  primary: "#3B82F6",    // Soft indigo/blue accent for dark mode
  accent: "#818CF8",     // Indigo-400
  border: "#334155",     // Slate-700
};

export const theme = {
  colors: lightColors,
  fontFamily: {
    heading: "Outfit-Bold",
    body: "Poppins-Regular",
    "body-medium": "Poppins-Medium",
    "body-semibold": "Poppins-SemiBold",
  },
};

export type ThemeColors = typeof lightColors;

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const themeMode = useThemeStore((state) => state.themeMode) || "system";

  const isDark = themeMode === "system" 
    ? systemScheme === "dark" 
    : themeMode === "dark";

  const colors = isDark ? darkColors : lightColors;

  return {
    isDark,
    themeMode,
    colors,
    fontFamily: theme.fontFamily,
  };
}
