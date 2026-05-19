import { useColorScheme } from "react-native";
import { useThemeStore } from "@/store/useThemeStore";

export const lightColors = {
  background: "#F0F4F8",   // Cool slate-blue white background
  card: "#FFFFFF",
  text: "#102A43",         // Deep navy professional text
  subtext: "#486581",      // Cool slate-blue subtext
  primary: "#2563EB",      // Vibrant Cobalt Blue primary
  accent: "#3B82F6",       // Blue 500 accent
  border: "#D9E2EC",       // Cool blue-gray border
};

export const darkColors = {
  background: "#070E20",  // Deep space midnight background
  card: "#121B32",        // Clean midnight blue card
  text: "#F0F4F8",        // Crisp cool-white text
  subtext: "#829AB1",     // Light cool-silver subtext
  primary: "#60A5FA",     // Sky blue primary for dark mode
  accent: "#93C5FD",      // Soft blue accent
  border: "#1D2A44",      // Midnight border
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
