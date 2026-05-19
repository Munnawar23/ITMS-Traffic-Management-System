/**
 * ITMS Intelligent Traffic System Registry Configuration
 * Centralized source of truth for dynamic environment variables and configurations.
 */
export const Config = {
  // Base Production URL for the Raspberry Pi 5 Gateway
  apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://api.itmso.in",

  // Base Production URL for the Traffic Authentication API
  authUrl: process.env.EXPO_PUBLIC_AUTH_URL || "https://auth.itmso.in",

  // Authorization plain-text key for Cloudflare Tunnel handshake
  apiKey: process.env.EXPO_PUBLIC_API_KEY || "open-me-098-i-am-open-098-ASD-hello-150",
};
