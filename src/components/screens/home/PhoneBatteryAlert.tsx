import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Battery from "expo-battery";
import { useTranslation } from "react-i18next";
import { theme, useAppTheme } from "@/styles/theme";

interface PhoneBatteryAlertProps {
  vipActive: boolean;
  vipLanesGreen: string[] | null;
}

export default function PhoneBatteryAlert({ vipActive, vipLanesGreen }: PhoneBatteryAlertProps) {
  const { t } = useTranslation();
  const { colors, isDark } = useAppTheme();
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
      } catch (err) {}
    }
    initPhoneBattery();
    return () => subscription?.remove();
  }, []);

  const isLow = phoneBatteryLevel < 0.25;

  // Render Premium Normal Card
  if (!vipActive) {
    return (
      <View style={styles.container}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("home.systemAlerts")}</Text>
        <View style={[styles.normalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: isDark ? "#ffffff08" : "#f1f5f9" }]}>
              <Ionicons 
                name={phoneBatteryCharging ? "battery-charging" : (isLow ? "battery-dead" : "battery-full")} 
                size={22} 
                color={isLow ? "#F59E0B" : "#10B981"} 
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
                {isLow ? t("home.phoneBatteryLow") : t("home.batteryHealthy")}
              </Text>
              <Text style={[styles.subtitle, { color: colors.subtext }]} numberOfLines={1}>
                {phoneBatteryCharging 
                  ? t("home.deviceCharging") 
                  : (isLow ? t("home.connectChargerSoon") : t("home.batteryChargedHealthy"))}
              </Text>
            </View>
            <View style={[styles.badge, { backgroundColor: (isLow ? "#F59E0B" : "#10B981") + "15" }]}>
              <Text style={[styles.badgeText, { color: isLow ? "#F59E0B" : "#10B981" }]}>
                {Math.round(phoneBatteryLevel * 100)}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Render VIP Emergency Red Gradient Card
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("home.systemAlerts")}</Text>
      <LinearGradient
        colors={["#DC2626", "#991B1B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.vipCard}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Ionicons name="shield-checkmark" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: "#FFFFFF" }]} numberOfLines={1}>
              {t("home.vipOverrideActive")}
            </Text>
            <Text style={[styles.subtitle, { color: "rgba(255,255,255,0.8)" }]} numberOfLines={1}>
              {`${t("home.forcingGreenLight")}: ${vipLanesGreen && vipLanesGreen.length > 0 ? vipLanesGreen.map(l => `L${l === "81" ? "1" : l === "82" ? "2" : l === "83" ? "3" : "4"}`).join(", ") : t("home.none")}`}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Text style={[styles.badgeText, { color: "#FFFFFF" }]}>VIP</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
           <View style={[styles.progressFill, { width: "100%", backgroundColor: "#FFFFFF" }]} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: theme.fontFamily["body-semibold"],
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  normalCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  vipCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontFamily: theme.fontFamily["body-semibold"],
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: theme.fontFamily.body,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 13,
    fontFamily: theme.fontFamily["body-semibold"],
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 2,
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
});
