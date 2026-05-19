import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Battery from "expo-battery";
import { useTranslation } from "react-i18next";
import { theme, useAppTheme } from "@/styles/theme";

interface SectionHeaderProps {
  title: string;
  badgeLabel?: string;
  badgeIcon?: keyof typeof Ionicons.glyphMap;
  badgeColor?: string;
  badgeBg?: string;
}

function SectionHeader({ title, badgeLabel, badgeIcon, badgeColor, badgeBg }: SectionHeaderProps) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {badgeLabel ? (
        <View style={[styles.sectionBadge, { backgroundColor: badgeBg }]}>
          {badgeIcon && <Ionicons name={badgeIcon} size={11} color={badgeColor} style={{ marginRight: 3 }} />}
          <Text style={[styles.sectionBadgeText, { color: badgeColor }]}>{badgeLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

interface PhoneBatteryAlertProps {
  vipActive: boolean;
  vipLanesGreen: string[] | null;
}

export default function PhoneBatteryAlert({ vipActive, vipLanesGreen }: PhoneBatteryAlertProps) {
  const { t } = useTranslation();
  const [phoneBatteryLevel, setPhoneBatteryLevel] = useState<number>(0.85); // Fallback to 85%
  const [phoneBatteryCharging, setPhoneBatteryCharging] = useState<boolean>(false);

  useEffect(() => {
    let subscription: Battery.Subscription | null = null;

    async function initPhoneBattery() {
      try {
        const level = await Battery.getBatteryLevelAsync();
        const state = await Battery.getBatteryStateAsync();
        setPhoneBatteryLevel(level >= 0 ? level : 0.85);
        setPhoneBatteryCharging(state === Battery.BatteryState.CHARGING || state === Battery.BatteryState.FULL);

        subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
          setPhoneBatteryLevel(batteryLevel);
        });
      } catch (err) {
        console.warn("[🔋 PhoneBatteryAlert] Failed to initialize phone battery level async:", err);
      }
    }

    initPhoneBattery();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View>
      <SectionHeader
        title={t("home.systemAlerts")}
        badgeLabel={vipActive ? "CRITICAL" : (phoneBatteryLevel < 0.25 ? "BATTERY LOW" : "SYSTEM OK")}
        badgeIcon={vipActive ? "warning" : (phoneBatteryLevel < 0.25 ? "battery-dead" : "checkmark-circle")}
        badgeColor={vipActive ? "#EF4444" : (phoneBatteryLevel < 0.25 ? "#D97706" : "#10B981")}
        badgeBg={vipActive ? "#EF444420" : (phoneBatteryLevel < 0.25 ? "#FBBF2420" : "#10B98120")}
      />

      <View style={styles.alertWrap}>
        <LinearGradient
          colors={vipActive ? ["#991B1B", "#DC2626", "#EF4444"] : ["#1E40AF", "#1D4ED8", "#6C63FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.alertGrad}
        >
          {/* Left accent bar */}
          <View style={[
            styles.alertAccentBar, 
            vipActive && { backgroundColor: "#EF4444" }, 
            !vipActive && { backgroundColor: phoneBatteryLevel < 0.25 ? "#FBBF24" : "#10B981" }
          ]} />

          <View style={styles.alertBody}>
            <View style={styles.alertIconBadge}>
              <Ionicons 
                name={vipActive ? "shield-checkmark" : (phoneBatteryCharging ? "battery-charging" : "battery-full")} 
                size={22} 
                color={vipActive ? "#FFFFFF" : (phoneBatteryLevel < 0.25 ? "#FBBF24" : "#34D399")} 
              />
            </View>

            <View style={styles.alertText}>
              <Text style={styles.alertTitle}>
                {vipActive 
                  ? "🚨 VIP OVERRIDE ACTIVE" 
                  : (phoneBatteryLevel < 0.25 ? "⚠️ PHONE BATTERY LOW" : "🔋 BATTERY HEALTHY")}
              </Text>
              <Text style={styles.alertSub}>
                {vipActive 
                  ? `Forcing green light: ${vipLanesGreen && vipLanesGreen.length > 0 ? vipLanesGreen.map(l => `L${l === "81" ? "1" : l === "82" ? "2" : l === "83" ? "3" : "4"}`).join(", ") : "None"}`
                  : (phoneBatteryCharging 
                      ? "Device is plugged in and charging." 
                      : (phoneBatteryLevel < 0.25 
                          ? "Connect charger soon to keep tracking." 
                          : "Phone battery is charged and healthy."))}
              </Text>
            </View>

            <View style={[
              styles.alertBadge, 
              vipActive && { backgroundColor: "#EF4444" }, 
              !vipActive && { backgroundColor: phoneBatteryLevel < 0.25 ? "rgba(251,191,36,0.2)" : "rgba(52,211,153,0.2)" }
            ]}>
              <Text style={[
                styles.alertBadgeText, 
                vipActive && { color: "#FFFFFF" }, 
                !vipActive && { color: phoneBatteryLevel < 0.25 ? "#FBBF24" : "#34D399" }
              ]}>
                {vipActive ? "VIP" : `${Math.round(phoneBatteryLevel * 100)}%`}
              </Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBg}>
            <LinearGradient
              colors={vipActive ? ["#EF4444", "#F87171"] : (phoneBatteryLevel < 0.25 ? ["#F59E0B", "#FBBF24"] : ["#10B981", "#34D399"])}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${vipActive ? 100 : Math.round(phoneBatteryLevel * 100)}%` as any }]}
            />
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.fontFamily.heading,
    color: theme.colors.text,
    letterSpacing: 0.3,
  },
  sectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontFamily: theme.fontFamily["body-semibold"],
  },
  alertWrap: {
    marginHorizontal: 16,
    borderRadius: 22,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    marginBottom: 6,
  },
  alertGrad: {
    paddingHorizontal: 18,
    paddingTop: 18,
    position: "relative",
  },
  alertAccentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  alertBody: {
    flexDirection: "row",
    alignItems: "flex-start", // Top align items so long text doesn't center them awkwardly
    marginBottom: 16,
  },
  alertIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2, // Slight top offset to match first line of text
  },
  alertText: {
    flex: 1,
    marginRight: 12, // Safe horizontal margin to prevent any overlap with the right badge
  },
  alertTitle: {
    fontSize: 17, // One size bigger title
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#FFFFFF",
    marginBottom: 4,
  },
  alertSub: {
    fontSize: 13, // One size bigger description
    fontFamily: theme.fontFamily.body,
    color: "#FFFFFF", // Solid white, full opacity!
    lineHeight: 18, // Breathing room
  },
  alertBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 2, // Matches top of circular badge
  },
  alertBadgeText: {
    fontSize: 18, // Bigger badge text
    fontFamily: theme.fontFamily.heading,
  },
  progressBg: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
