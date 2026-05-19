import StatusCard from "@/components/screens/home/StatusCard";
import TopIndicator from "@/components/common/TopIndicator";
import { useAuthStore } from "@/store/authStore";
import { theme } from "@/styles/theme";
import { formatDate, getGreeting } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { useTrafficStore } from "@/store/useTrafficStore";
import { useTranslation } from "react-i18next";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Battery from "expo-battery";

/* ─────────────────────────────────────────────────────── */
/*  Small animated section wrapper (Keep for Hero)        */
/* ─────────────────────────────────────────────────────── */
function FadeSlideIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) }),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

/* ─────────────────────────────────────────────────────── */
/*  Sub-components                                        */
/* ─────────────────────────────────────────────────────── */

function SectionHeader({
  title,
  badgeLabel,
  badgeIcon,
  badgeColor = theme.colors.accent,
  badgeBg,
}: {
  title: string;
  badgeLabel: string;
  badgeIcon: any;
  badgeColor?: string;
  badgeBg?: string;
}) {
  return (
    <View style={shStyles.header}>
      <Text style={shStyles.title}>{title}</Text>
      <View
        style={[
          shStyles.badge,
          { backgroundColor: badgeBg ?? badgeColor + "18" },
        ]}
      >
        <Ionicons name={badgeIcon} size={13} color={badgeColor} />
        <Text style={[shStyles.badgeText, { color: badgeColor }]}>
          {badgeLabel}
        </Text>
      </View>
    </View>
  );
}

const shStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 24,
  },
  title: {
    fontSize: 16,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: theme.fontFamily["body-medium"],
    letterSpacing: 0.2,
  },
});

/* ─────────────────────────────────────────────────────── */
/*  Main screen                                           */
/* ─────────────────────────────────────────────────────── */
export default function HomeScreen() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const greeting = getGreeting(t);
  const dateStr = formatDate();

  const firstName = user?.name?.split(" ")[0] ?? "Jawan";
  const initial = firstName.charAt(0).toUpperCase();

  // Retrieve active traffic light statuses from Zustand store
  const { currentMode, inferenceHas, vipActive, vipLanesGreen, logs, fetchStatus, fetchLogs, error } = useTrafficStore();

  // Real phone battery status states
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
        console.warn("[🏠 HOME SCREEN] Failed to initialize phone battery level async:", err);
      }
    }

    initPhoneBattery();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Poll status and fetch logs when screen is mounted
  useEffect(() => {
    console.log(`[🏠 HOME SCREEN] Component mounted. Running initial hardware status check & fetching daily logs...`);
    fetchStatus();
    fetchLogs();
    const interval = setInterval(() => {
      console.log(`[🏠 HOME SCREEN] ⏱️ 5-second polling interval triggered. Syncing RPi5 state...`);
      fetchStatus();
    }, 5000);
    return () => {
      console.log(`[🏠 HOME SCREEN] Component unmounting. Stopping background polling interval.`);
      clearInterval(interval);
    };
  }, [fetchStatus, fetchLogs]);

  // Helper to translate active API mode to visual labels, icons, and colors
  const getModeDetails = () => {
    switch (currentMode) {
      case "auto":
        return {
          value: t("mode.auto", "AI Jump"),
          icon: "hardware-chip-outline" as const,
          color: "#34D399",
        };
      case "cycle_auto":
        return {
          value: t("mode.cycle_auto", "AI Cycle"),
          icon: "sync-outline" as const,
          color: "#10B981",
        };
      case "set_manual":
      case "manual":
        return {
          value: t("mode.timeset", "Scheduled"),
          icon: "time-outline" as const,
          color: "#818CF8",
        };
      case "yellow":
        return {
          value: t("mode.blinker", "Blinker"),
          icon: "flash-outline" as const,
          color: "#FBBF24",
        };
      case "vip":
        return {
          value: t("mode.vip", "VIP Priority"),
          icon: "shield-checkmark-outline" as const,
          color: "#F87171",
        };
      default:
        return {
          value: t("mode.none", "Offline"),
          icon: "cloud-offline-outline" as const,
          color: "#9CA3AF",
        };
    }
  };

  const modeInfo = getModeDetails();

  // Map live RPi5 database logs to dashboard action items
  const recentActions = [...logs]
    .reverse() // Sort newest first
    .slice(0, 4) // Limit to the most recent 4 cycles
    .map((item, idx) => {
      const laneNum = item.lane === "81" ? "1" : item.lane === "82" ? "2" : item.lane === "83" ? "3" : "4";
      const vehicleDesc = item.total_vehicles > 0 
        ? `${item.total_vehicles} vehicles detected` 
        : `No vehicles detected`;
      
      let iconName: keyof typeof Ionicons.glyphMap = "sync-outline";
      if (item.mode === "vip") iconName = "shield-checkmark-outline";
      if (item.mode === "yellow") iconName = "flash-outline";
      if (item.mode === "set_manual" || item.mode === "manual") iconName = "time-outline";

      return {
        id: `live_${idx}_${item.time}`,
        time: item.time.substring(0, 5), // Format HH:MM
        desc: `Lane ${laneNum} Green for ${item.green_duration}s (${vehicleDesc})`,
        icon: iconName,
      };
    });

  const renderHeader = () => (
    <View>
      {/* ── Hero Banner ──────────────────────────────────── */}
      <FadeSlideIn delay={0}>
        <View style={styles.heroWrap}>
          <LinearGradient
            colors={["#1E40AF", "#1D4ED8", "#6C63FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroBg}
          >
            {/* Decorative blobs */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />
            <View style={styles.blob3} />

            {/* Top row */}
            <View style={styles.heroTop}>
              <View style={styles.heroLeft}>
                <Text style={styles.heroGreeting}>
                  {t("home.welcomeBack")} 👋
                </Text>
                <Text style={styles.heroName}>Jawan</Text>
              </View>

              {/* Avatar */}
              <LinearGradient
                colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{initial}</Text>
              </LinearGradient>
            </View>

            {/* Divider */}
            <View style={styles.heroDivider} />

            {/* Bottom row */}
            <View style={styles.heroBottom}>
              <View style={styles.heroPill}>
                <Ionicons name="calendar-outline" size={12} color="#FFFFFF" />
                <Text style={styles.heroPillText}>{dateStr}</Text>
              </View>

              <View style={styles.livePill}>
                <View style={styles.liveDot} />
                <Text style={styles.liveLabel}>LIVE</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </FadeSlideIn>


      {/* ── System Alert ─────────────────────────────────── */}
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
          <View style={[styles.alertAccentBar, vipActive && { backgroundColor: "#EF4444" }, !vipActive && { backgroundColor: phoneBatteryLevel < 0.25 ? "#FBBF24" : "#10B981" }]} />

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
                  ? "🚨 EMERGENCY OVERRIDE ACTIVE" 
                  : (phoneBatteryLevel < 0.25 ? "⚠️ PHONE BATTERY LOW" : "🔋 PHONE BATTERY HEALTHY")}
              </Text>
              <Text style={styles.alertSub}>
                {vipActive 
                  ? `Forcing Green Light on: ${vipLanesGreen && vipLanesGreen.length > 0 ? vipLanesGreen.map(l => `Lane ${l === "81" ? "1" : l === "82" ? "2" : l === "83" ? "3" : "4"}`).join(", ") : "No Lanes selected"}`
                  : (phoneBatteryCharging 
                      ? "Your mobile device is currently plugged in and charging." 
                      : (phoneBatteryLevel < 0.25 
                          ? "Please connect your phone to a charger soon to keep monitoring streets." 
                          : "Your mobile device is fully optimized and ready for operations."))}
              </Text>
            </View>

            <View style={[styles.alertBadge, vipActive && { backgroundColor: "#EF4444" }, !vipActive && { backgroundColor: phoneBatteryLevel < 0.25 ? "rgba(251,191,36,0.2)" : "rgba(52,211,153,0.2)" }]}>
              <Text style={[styles.alertBadgeText, vipActive && { color: "#FFFFFF" }, !vipActive && { color: phoneBatteryLevel < 0.25 ? "#FBBF24" : "#34D399" }]}>
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

      {/* ── Junction Status ──────────────────────────────── */}
      <SectionHeader
        title={t("home.junctionStatus")}
        badgeLabel={t("home.realTime")}
        badgeIcon="pulse"
      />

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

      {/* ── Recent Actions Header ───────────────────────── */}
      <SectionHeader
        title={t("home.recentActions")}
        badgeLabel={t("home.today")}
        badgeIcon="time-outline"
      />
    </View>
  );

  const renderItem = ({ item }: { item: (typeof recentActions)[0] }) => {
    const isWarning = item.icon === "shield-checkmark-outline";
    const accent = isWarning ? "#F87171" : theme.colors.accent;
    return (
      <View style={styles.actionRow}>
        {/* Left accent bar */}
        <View style={[styles.actionAccent, { backgroundColor: accent }]} />
        {/* Icon chip */}
        <View
          style={[styles.actionIconChip, { backgroundColor: accent + "18" }]}
        >
          <Ionicons name={item.icon} size={16} color={accent} />
        </View>
        {/* Text */}
        <View style={styles.actionText}>
          <Text style={styles.actionDesc}>{item.desc}</Text>
          <View style={styles.actionMeta}>
            <Ionicons name="time-outline" size={11} color="#6B7280" />
            <Text style={styles.actionTime}>{item.time}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TopIndicator />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {recentActions.length === 0 ? (
          <View style={styles.actionRowEmpty}>
            <Ionicons name="sparkles-outline" size={16} color="#9CA3AF" style={{ marginRight: 8 }} />
            <Text style={styles.actionDescEmpty}>Waiting for physical traffic cycles...</Text>
          </View>
        ) : (
          recentActions.map((item) => (
            <React.Fragment key={item.id}>
              {renderItem({ item })}
            </React.Fragment>
          ))
        )}
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

  /* Hero */
  heroWrap: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 6,
    borderRadius: 26,
    overflow: "hidden",
    elevation: 14,
  },
  heroBg: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 18,
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(108,99,255,0.14)",
  },
  blob2: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  blob3: {
    position: "absolute",
    top: 30,
    left: "50%",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(108,99,255,0.07)",
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  heroLeft: {
    flex: 1,
  },
  heroGreeting: {
    fontSize: 15,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#FFFFFF",
    marginBottom: 4,
  },
  heroName: {
    fontSize: 30,
    fontFamily: theme.fontFamily.heading,
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: {
    fontSize: 22,
    fontFamily: theme.fontFamily.heading,
    color: "#FFFFFF",
  },
  heroDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 16,
  },
  heroBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  heroPillText: {
    fontSize: 12,
    fontFamily: theme.fontFamily.body,
    color: "#FFFFFF",
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(52,211,153,0.14)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(52,211,153,0.25)",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#34D399",
  },
  liveLabel: {
    fontSize: 11,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#34D399",
    letterSpacing: 1.2,
  },


  /* Stats grid */
  statsGrid: {
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
  },

  /* Alert */
  alertWrap: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
  },
  alertGrad: {
    borderRadius: 20,
    overflow: "hidden",
    flexDirection: "column",
  },
  alertAccentBar: {
    height: 3,
    backgroundColor: "#FBBF24",
    width: "100%",
  },
  alertBody: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  alertIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "rgba(251,191,36,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#FFFFFF",
    marginBottom: 2,
  },
  alertSub: {
    fontSize: 12,
    fontFamily: theme.fontFamily.body,
    color: "rgba(255,255,255,0.7)",
  },
  alertBadge: {
    backgroundColor: "rgba(251,191,36,0.22)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  alertBadgeText: {
    fontSize: 17,
    fontFamily: theme.fontFamily.heading,
    color: "#FBBF24",
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
    width: "39%",
    height: "100%",
    borderRadius: 2,
  },

  /* Action Row */
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    overflow: "hidden",
    paddingVertical: 16,
    paddingRight: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  actionAccent: {
    width: 5,
    alignSelf: "stretch",
    borderRadius: 2.5,
    marginRight: 12,
  },
  actionIconChip: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionDesc: {
    fontSize: 15,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#111827",
    marginBottom: 6,
    lineHeight: 20,
  },
  actionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionTime: {
    fontSize: 13,
    fontFamily: theme.fontFamily.body,
    color: "#6B7280",
  },
  actionRowEmpty: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    paddingVertical: 18,
  },
  actionDescEmpty: {
    fontSize: 14,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#9CA3AF",
  },
});
