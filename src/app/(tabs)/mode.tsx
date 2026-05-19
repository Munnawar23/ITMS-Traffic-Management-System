import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";

import TopIndicator from "@/components/common/TopIndicator";
import ModeCard from "@/components/screens/mode/ModeCard";
import UnifiedModeModal from "@/components/screens/mode/UnifiedModeModal";
import ActiveModeStatus from "@/components/screens/mode/ActiveModeStatus";
import { MODES, ModeKey } from "@/constants";
import { theme } from "@/styles/theme";
import { wp, hp } from "@/helpers";
import { useTrafficStore } from "@/store/useTrafficStore";
import { ApiMode } from "@/types/traffic";

export default function ModeScreen() {
  const { t } = useTranslation();
  const [activeModalKey, setActiveModalKey] = useState<ModeKey | null>(null);

  // Retrieve state and actions from the Zustand Traffic Store
  const {
    currentMode,
    isLoading,
    fetchStatus,
    switchMode,
    selectedStrategy,
    laneTimes,
    selectedVipLanes,
    selectedBlinkerLanes,
  } = useTrafficStore();

  // Helper to map Raspberry Pi hardware modes back to UI mode keys
  const getUiModeFromApiMode = (apiMode: ApiMode): ModeKey => {
    if (apiMode === "auto" || apiMode === "cycle_auto") return "auto";
    if (apiMode === "yellow") return "blinker";
    if (apiMode === "vip") return "vip";
    return "timeset"; // set_manual, manual, none default to timeset
  };

  // 🔄 Real-time Background Polling: updates UI state every 5 seconds
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      fetchStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleModeChange = async (key: ModeKey) => {
    console.log(`[📱 MODE SCREEN] User tapped mode card: "${key}". Opening configuration modal...`);
    setActiveModalKey(key);
  };

  const handleCancel = () => {
    console.log(`[📱 MODE SCREEN] User cancelled configuration modal.`);
    setActiveModalKey(null);
  };

  const handleDone = async (data: any) => {
    if (!activeModalKey) return;

    console.log(`[📱 MODE SCREEN] User submitted config modal for: "${activeModalKey}". Options:`, JSON.stringify(data, null, 2));
    try {
      // Trigger RPi5 hardware changes
      await switchMode(activeModalKey, data);
      console.log(`[📱 MODE SCREEN] ✅ Mode "${activeModalKey}" successfully applied on hardware. Showing success notifications...`);

      // Show localized Success toast & play success haptic
      Toast.show({
        type: "success",
        text1: t(`mode.${activeModalKey}Modal.toastTitle`),
        text2: t(`mode.${activeModalKey}Modal.toastSubtitle`),
        position: "bottom",
        visibilityTime: 4000,
        autoHide: true,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      console.error(`[📱 MODE SCREEN] ❌ Failed to apply mode "${activeModalKey}"! Error details:`, err.message || err);
      // Show error toast on failure & play error haptic
      Toast.show({
        type: "error",
        text1: t("mode.errorTitle", "Connection Error"),
        text2: err.message || t("mode.errorSubtitle", "Could not apply settings on controller."),
        position: "bottom",
        visibilityTime: 5000,
        autoHide: true,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } finally {
      setActiveModalKey(null);
    }
  };

  const getInitialData = () => {
    if (activeModalKey === "timeset") return laneTimes;
    if (activeModalKey === "auto") return selectedStrategy;
    if (activeModalKey === "vip") return selectedVipLanes;
    if (activeModalKey === "blinker") return selectedBlinkerLanes;
    return null;
  };

  const activeModeKey = getUiModeFromApiMode(currentMode);
  const active = MODES.find((m) => m.key === activeModeKey) || MODES[0];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* ── Top Indicator Strip ────────────────────────────── */}
      <TopIndicator />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>{t("mode.selectionTitle")}</Text>
              <Text style={styles.headerSubtitle}>{t("mode.systemOnline")}</Text>
            </View>
            {isLoading && (
              <ActivityIndicator size="small" color={theme.colors.accent} style={styles.loader} />
            )}
          </View>
        </View>

        {/* ── Section Header ───────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>{t("mode.availableModes")}</Text>
            <Text style={styles.sectionSub}>
              Select a signal control strategy
            </Text>
          </View>
          <View style={styles.sectionBadge}>
            <Ionicons name="pulse" size={12} color={theme.colors.accent} />
            <Text style={styles.sectionBadgeText}>{t("mode.realTime")}</Text>
          </View>
        </View>

        {/* ── Mode Cards ── */}
        <View style={styles.cardsWrap}>
          {MODES.map((mode) => (
            <ModeCard
              key={mode.key}
              mode={mode}
              isActive={activeModeKey === mode.key}
              label={t(`mode.${mode.key}`)}
              description={mode.description}
              onPress={() => handleModeChange(mode.key)}
              disabled={isLoading}
            />
          ))}
        </View>

        {/* ── Active Mode Status Card ── */}
        <ActiveModeStatus active={active} />

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Unified Dynamic Modal ── */}
      <UnifiedModeModal
        visible={activeModalKey !== null}
        modeKey={activeModalKey}
        initialData={getInitialData()}
        onCancel={handleCancel}
        onDone={handleDone}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2.5),
    paddingBottom: hp(1.5),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: theme.fontFamily.body,
    color: "#64748B",
    marginTop: 2,
  },
  loader: {
    marginRight: wp(2),
  },
  scrollContent: {
    paddingBottom: hp(4),
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    marginTop: hp(3),
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  sectionSub: {
    fontSize: 12,
    fontFamily: theme.fontFamily.body,
    color: "#64748B",
    marginTop: 2,
  },
  sectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  sectionBadgeText: {
    fontSize: 10,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.primary,
  },
  cardsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    rowGap: wp(3.5),
  },
});

