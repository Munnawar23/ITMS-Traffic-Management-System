import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import TopIndicator from "@/components/common/TopIndicator";
import { useAuthStore } from "@/store/authStore";
import { useTrafficStore } from "@/store/useTrafficStore";
import { formatDate } from "@/utils/dateUtils";
import { useAppTheme } from "@/styles/theme";

// Modular Screen Components
import HeroBanner from "@/components/screens/home/HeroBanner";
import PhoneBatteryAlert from "@/components/screens/home/PhoneBatteryAlert";
import RecentActionsList from "@/components/screens/home/RecentActionsList";
import StatusCard from "@/components/screens/home/StatusCard";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const dateStr = formatDate();

  const firstName = user?.name?.split(" ")[0] ?? "Jawan";
  const initial = firstName.charAt(0).toUpperCase();

  // Retrieve active traffic light statuses and action logs from Zustand store
  const { currentMode, inferenceHas, vipActive, vipLanesGreen, logs, fetchStatus, fetchLogs, error } = useTrafficStore();

  // Fetch status and daily logs fresh when screen mounts
  useEffect(() => {
    console.log(`[🏠 HOME SCREEN] Component mounted. Fetching initial hardware status & logs...`);
    fetchStatus();
    fetchLogs();
  }, [fetchStatus, fetchLogs]);

  // Helper to translate active API mode to visual labels, icons, and colors
  const getModeDetails = () => {
    switch (currentMode) {
      case "auto":
        return {
          value: t("mode.auto", "AI Jump"),
          icon: "hardware-chip-outline" as const,
          color: "#10B981",
        };
      case "cycle_auto":
        return {
          value: t("mode.cycle_auto", "AI Cycle"),
          icon: "sync-circle-outline" as const,
          color: "#10B981",
        };
      case "yellow":
        return {
          value: t("mode.blinker", "Blinker"),
          icon: "flash-outline" as const,
          color: "#F59E0B",
        };
      case "set_manual":
      case "manual":
        return {
          value: t("mode.timeset", "Scheduled"),
          icon: "time-outline" as const,
          color: "#6C63FF",
        };
      case "vip":
        return {
          value: "VIP Override",
          icon: "shield-checkmark" as const,
          color: "#EF4444",
        };
      default:
        return {
          value: t("home.connecting", "Connecting..."),
          icon: "cloud-offline-outline" as const,
          color: "#9CA3AF",
        };
    }
  };

  const modeInfo = getModeDetails();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <TopIndicator />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome greeting card */}
        <HeroBanner firstName={firstName} initial={initial} dateStr={dateStr} />

        {/* Live operational status cards */}
        <View style={styles.statsGrid}>
          <View style={styles.row}>
            <StatusCard
              label={t("home.junction")}
              value="Fatehpura Circle"
              icon="location"
              accentColor="#6C63FF"
              gradientColors={["#1E40AF", "#1D4ED8", "#6C63FF"]}
            />
            <View style={{ width: 12 }} />
            <StatusCard
              label={t("home.status")}
              value={error ? t("home.offline", "Offline") : t("home.running", "Online")}
              icon={error ? "cloud-offline-outline" : "pulse"}
              valueColor={error ? "#EF4444" : "#34D399"}
              accentColor={error ? "#EF4444" : "#34D399"}
              gradientColors={["#1E40AF", "#1D4ED8", "#6C63FF"]}
              isPulsing={!error}
            />
          </View>
          <View style={styles.row}>
            <StatusCard
              label={t("home.mode")}
              value={modeInfo.value}
              icon={modeInfo.icon}
              valueColor={modeInfo.color}
              accentColor={modeInfo.color}
              gradientColors={["#1E40AF", "#1D4ED8", "#6C63FF"]}
            />
            <View style={{ width: 12 }} />
            <StatusCard
              label="YOLO AI Detect"
              value={inferenceHas ? t("home.active", "Active") : t("home.inactive", "Inactive")}
              icon="eye-outline"
              valueColor={inferenceHas ? "#34D399" : "#9CA3AF"}
              accentColor={inferenceHas ? "#34D399" : "#9CA3AF"}
              gradientColors={["#1E40AF", "#1D4ED8", "#6C63FF"]}
              isPulsing={inferenceHas}
            />
          </View>
        </View>

        {/* Real-time native phone battery & emergency warning alert */}
        <PhoneBatteryAlert vipActive={vipActive} vipLanesGreen={vipLanesGreen} />

        {/* Dynamic Recent YOLO Action cycles feed */}
        <RecentActionsList logs={logs} />

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FB",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  statsGrid: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
});
