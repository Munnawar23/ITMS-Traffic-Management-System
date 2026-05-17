export type ModeKey = "timeset" | "auto" | "blinker" | "vip";

export interface ModeOption {
  key: ModeKey;
  icon: any;
  accent: string;
  gradientStart: string;
  gradientEnd: string;
  description: string;
}

export const MODES: ModeOption[] = [
  {
    key: "timeset",
    icon: "time-outline",
    accent: "#818CF8",
    gradientStart: "#3730A3",
    gradientEnd: "#6C63FF",
    description: "Scheduled signal intervals",
  },
  {
    key: "auto",
    icon: "hardware-chip-outline",
    accent: "#34D399",
    gradientStart: "#065F46",
    gradientEnd: "#10B981",
    description: "AI-driven traffic control",
  },
  {
    key: "blinker",
    icon: "flash-outline",
    accent: "#FBBF24",
    gradientStart: "#92400E",
    gradientEnd: "#F59E0B",
    description: "Warning yellow flash mode",
  },
  {
    key: "vip",
    icon: "shield-checkmark-outline",
    accent: "#F87171",
    gradientStart: "#7F1D1D",
    gradientEnd: "#EF4444",
    description: "Emergency priority clearance",
  },
];
