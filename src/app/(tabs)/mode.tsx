import TopIndicator from "@/components/TopIndicator";
import { hp, wp } from "@/helpers";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ─────────────────────────────────────────────────────── */
/*  Types & Data                                           */
/* ─────────────────────────────────────────────────────── */
type ModeKey = "timeset" | "auto" | "blinker" | "vip";

interface ModeOption {
  key: ModeKey;
  icon: any;
  accent: string;
  gradientStart: string;
  gradientEnd: string;
  description: string;
}

/* ─────────────────────────────────────────────────────── */
/*  Animated Mode Card                                     */
/* ─────────────────────────────────────────────────────── */
function ModeCard({
  mode,
  isActive,
  label,
  description,
  onPress,
}: {
  mode: ModeOption;
  isActive: boolean;
  label: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.modeCard, isActive && styles.modeCardActive]}
    >
      {isActive ? (
        <LinearGradient
          colors={[mode.gradientStart, mode.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      {/* Left: Icon */}
      <View
        style={[
          styles.cardIconWrap,
          {
            backgroundColor: isActive
              ? "rgba(255,255,255,0.18)"
              : mode.accent + "18",
            borderColor: isActive
              ? "rgba(255,255,255,0.25)"
              : mode.accent + "30",
          },
        ]}
      >
        <Ionicons
          name={mode.icon}
          size={26}
          color={isActive ? "#FFFFFF" : mode.accent}
        />
      </View>

      {/* Center: Labels */}
      <View style={styles.cardBody}>
        <Text
          style={[
            styles.cardLabel,
            { color: isActive ? "#FFFFFF" : theme.colors.text },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.cardDesc,
            {
              color: isActive ? "#FFFFFF" : theme.colors.text,
            },
          ]}
        >
          {description}
        </Text>
      </View>

      {/* Right: Status pill */}
      <View
        style={[
          styles.cardPill,
          isActive
            ? styles.cardPillActive
            : { backgroundColor: "#F1F5F9", borderColor: "#E2E8F0" },
        ]}
      >
        {isActive ? (
          <View style={styles.pillDot} />
        ) : (
          <View style={[styles.pillDot, { backgroundColor: "#CBD5E1" }]} />
        )}
        <Text
          style={[
            styles.pillText,
            {
              color: isActive ? "#34D399" : "#94A3B8",
            },
          ]}
        >
          {isActive ? "ON" : "OFF"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  Main Screen                                            */
/* ─────────────────────────────────────────────────────── */
export default function ModeScreen() {
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<ModeKey>("blinker");

  const MODES: ModeOption[] = [
    {
      key: "timeset",
      icon: "time-outline",
      accent: "#818CF8",
      gradientStart: "#3730A3",
      gradientEnd: "#6C63FF",
      description: t("mode.timeset") + " — Scheduled intervals",
    },
    {
      key: "auto",
      icon: "hardware-chip-outline",
      accent: "#34D399",
      gradientStart: "#065F46",
      gradientEnd: "#10B981",
      description: t("mode.auto") + " — AI-driven control",
    },
    {
      key: "blinker",
      icon: "flash-outline",
      accent: "#FBBF24",
      gradientStart: "#92400E",
      gradientEnd: "#F59E0B",
      description: t("mode.blinker") + " — Warning flash mode",
    },
    {
      key: "vip",
      icon: "shield-checkmark-outline",
      accent: "#F87171",
      gradientStart: "#7F1D1D",
      gradientEnd: "#EF4444",
      description: t("mode.vip") + " — Priority clearance",
    },
  ];

  const active = MODES.find((m) => m.key === activeMode)!;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TopIndicator />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Screen Header ───────────────────────────────── */}

        {/* ── Section Header ─────────────────────────────── */}
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

        {/* ── Mode Cards ──────────────────────────────────── */}
        <View style={styles.cardsWrap}>
          {MODES.map((mode) => (
            <ModeCard
              key={mode.key}
              mode={mode}
              isActive={activeMode === mode.key}
              label={t(`mode.${mode.key}`)}
              description={mode.description}
              onPress={() => setActiveMode(mode.key)}
            />
          ))}
        </View>

        {/* ── Info Strip ──────────────────────────────────── */}
        <View style={styles.infoStrip}>
          <Ionicons
            name="information-circle-outline"
            size={15}
            color="#64748B"
          />
          <Text style={styles.infoText}>
            Changing mode takes effect at the next signal cycle.
          </Text>
        </View>

        {/* ── System Monitor ────────────────────────────────── */}
        <View style={styles.monitorCard}>
          <View style={styles.monitorHeader}>
            <Ionicons name="analytics" size={18} color={theme.colors.primary} />
            <Text style={styles.monitorTitle}>SYSTEM PERFORMANCE</Text>
          </View>
          
          <View style={styles.monitorGrid}>


            <View style={styles.monitorItem}>
              <View style={[styles.monitorIconWrap, { backgroundColor: "#34D39915" }]}>
                <Ionicons name="cloud-done" size={20} color="#059669" />
              </View>
              <View>
                <Text style={styles.monitorLabel}>CLOUD SYNC</Text>
                <Text style={styles.monitorValue}>Stable Connectivity</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  Styles                                                 */
/* ─────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: hp(4),
  },

  /* ── Header Components ────────────────────────────── */
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#10B981",
  },
  statusDotPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 11,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#059669",
    letterSpacing: 0.5,
  },

  /* ── Section Header ───────────────────────────────── */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: wp(5),
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 13,
    fontFamily: theme.fontFamily.body,
    color: theme.colors.text,
  },
  sectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: theme.colors.accent + "15",
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: 20,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontFamily: theme.fontFamily["body-medium"],
    color: theme.colors.accent,
  },

  /* ── Cards ────────────────────────────────────────── */
  cardsWrap: {
    paddingHorizontal: wp(4),
    gap: hp(1.5),
  },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(4.5),
    gap: wp(3.5),
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    position: "relative",
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.04)",
  },
  modeCardActive: {
    elevation: 14,
    shadowOpacity: 0.22,
    borderColor: "transparent",
  },
  cardIconWrap: {
    width: wp(14),
    height: wp(14),
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  cardBody: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 17,
    fontFamily: theme.fontFamily["body-semibold"],
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: theme.fontFamily.body,
    lineHeight: 20,
  },
  cardPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.6),
    borderRadius: 20,
    borderWidth: 1,
  },
  cardPillActive: {
    backgroundColor: "rgba(52,211,153,0.15)",
    borderColor: "#34D399",
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#34D399",
  },
  pillText: {
    fontSize: 11,
    fontFamily: theme.fontFamily["body-semibold"],
    letterSpacing: 0.5,
  },

  /* ── Info Strip ───────────────────────────────────── */
  infoStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginHorizontal: wp(5),
    marginTop: hp(2.5),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1.2),
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: theme.fontFamily.body,
    color: theme.colors.text,
    lineHeight: 18,
  },

  /* ── System Monitor ───────────────────────────────── */
  monitorCard: {
    marginHorizontal: wp(4),
    marginTop: hp(3),
    padding: wp(5),
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  monitorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: hp(2),
  },
  monitorTitle: {
    fontSize: 13,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  monitorGrid: {
    gap: hp(2.5),
  },
  monitorItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  monitorIconWrap: {
    width: wp(12),
    height: wp(12),
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  monitorLabel: {
    fontSize: 11,
    fontFamily: theme.fontFamily["body-medium"],
    color: theme.colors.text,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  monitorValue: {
    fontSize: 16,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
  },
});
