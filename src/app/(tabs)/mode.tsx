import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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

export default function ModeScreen() {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<ModeKey>("blinker");
  const [activeModalKey, setActiveModalKey] = useState<ModeKey | null>(null);
  
  const [selectedStrategy, setSelectedStrategy] = useState<"cycle" | "jump">("cycle");
  
  const [selectedVipLanes, setSelectedVipLanes] = useState({
    lane1: false,
    lane2: false,
    lane3: false,
    lane4: false,
  });

  const [selectedBlinkerLanes, setSelectedBlinkerLanes] = useState({
    lane1: false,
    lane2: false,
    lane3: false,
    lane4: false,
  });

  const [laneTimes, setLaneTimes] = useState({
    lane1: "",
    lane2: "",
    lane3: "",
    lane4: "",
  });

  const handleModeChange = async (key: ModeKey) => {
    setActiveModalKey(key);
  };

  const handleCancel = () => {
    setActiveModalKey(null);
  };

  const handleDone = async (data: any) => {
    if (!activeModalKey) return;

    if (activeModalKey === "timeset") {
      setLaneTimes(data);
    } else if (activeModalKey === "auto") {
      setSelectedStrategy(data);
    } else if (activeModalKey === "vip") {
      setSelectedVipLanes(data);
    } else if (activeModalKey === "blinker") {
      setSelectedBlinkerLanes(data);
    }

    const appliedMode = activeModalKey;
    setActiveMode(appliedMode);
    setActiveModalKey(null);

    // Show premium localized Toast from bottom
    Toast.show({
      type: "success",
      text1: t(`mode.${appliedMode}Modal.toastTitle`),
      text2: t(`mode.${appliedMode}Modal.toastSubtitle`),
      position: "bottom",
      visibilityTime: 4000,
      autoHide: true,
    });

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const getInitialData = () => {
    if (activeModalKey === "timeset") return laneTimes;
    if (activeModalKey === "auto") return selectedStrategy;
    if (activeModalKey === "vip") return selectedVipLanes;
    if (activeModalKey === "blinker") return selectedBlinkerLanes;
    return null;
  };

  const active = MODES.find((m) => m.key === activeMode)!;

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
          <Text style={styles.headerTitle}>{t("mode.selectionTitle")}</Text>
          <Text style={styles.headerSubtitle}>{t("mode.systemOnline")}</Text>
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
              isActive={activeMode === mode.key}
              label={t(`mode.${mode.key}`)}
              description={mode.description}
              onPress={() => handleModeChange(mode.key)}
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
