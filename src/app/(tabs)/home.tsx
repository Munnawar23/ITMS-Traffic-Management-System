import StatusCard from "@/components/screens/home/StatusCard";
import TopIndicator from "@/components/TopIndicator";
import { useAuthStore } from "@/store/authStore";
import { theme } from "@/styles/theme";
import { formatDate, getGreeting } from "@/utils/dateUtils";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

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
function MetricChip({
  icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={chipStyles.wrap}>
      <View style={[chipStyles.iconCircle, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={chipStyles.value}>{value}</Text>
      <Text style={chipStyles.label}>{label}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(30,64,175,0.07)",
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontFamily: theme.fontFamily.heading,
    color: "#000000",
    marginBottom: 1,
  },
  label: {
    fontSize: 11,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#000000",
    textAlign: "center",
  },
});

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

  const recentActions = [
    {
      id: "1",
      time: "9:41 AM",
      desc: "Switched from Circle_auto → Circle_man",
      icon: "swap-horizontal" as const,
    },
    {
      id: "2",
      time: "3:23 PM",
      desc: "Signal timing adjusted for Circle_auto",
      icon: "timer-outline" as const,
    },
    {
      id: "3",
      time: "9:28 AM",
      desc: "Emergency override active → Circle_auto",
      icon: "warning-outline" as const,
    },
    {
      id: "4",
      time: "9:03 AM",
      desc: "Switched from Circle_man → Circle_auto",
      icon: "swap-horizontal" as const,
    },
  ];

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

      {/* ── Quick Metrics strip ──────────────────────────── */}
      <View style={styles.metricsStrip}>
        <MetricChip
          icon="git-network-outline"
          label="Junctions"
          value="12"
          color="#6C63FF"
        />
        <MetricChip icon="pulse" label="Online" value="11" color="#34D399" />
        <MetricChip
          icon="alert-circle-outline"
          label="Alerts"
          value="1"
          color="#FBBF24"
        />
        <MetricChip
          icon="speedometer-outline"
          label="Avg Delay"
          value="4s"
          color="#60A5FA"
        />
      </View>

      {/* ── System Alert ─────────────────────────────────── */}
      <SectionHeader
        title={t("home.systemAlerts")}
        badgeLabel={t("home.oneAlert")}
        badgeIcon="alert-circle"
        badgeColor="#D97706"
        badgeBg="#FBBF2420"
      />

      <View style={styles.alertWrap}>
        <LinearGradient
          colors={["#1E40AF", "#1D4ED8", "#6C63FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.alertGrad}
        >
          {/* Left accent bar */}
          <View style={styles.alertAccentBar} />

          <View style={styles.alertBody}>
            <View style={styles.alertIconBadge}>
              <Ionicons name="battery-charging" size={22} color="#FBBF24" />
            </View>

            <View style={styles.alertText}>
              <Text style={styles.alertTitle}>{t("home.lowBattery")}</Text>
              <Text style={styles.alertSub}>{t("home.batteryDesc")}</Text>
            </View>

            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>39%</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBg}>
            <LinearGradient
              colors={["#F59E0B", "#FBBF24"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressFill}
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
            value={t("home.running")}
            icon="pulse"
            valueColor="#34D399"
            accentColor="#34D399"
            gradientColors={["#1E40AF", "#1D4ED8", "#6C63FF"]}
            isPulsing
          />
        </View>
        <View style={styles.row}>
          <StatusCard
            label={t("home.mode")}
            value={t("home.yellow")}
            icon="construct"
            valueColor="#FBBF24"
            accentColor="#FBBF24"
            gradientColors={["#1E40AF", "#1D4ED8", "#6C63FF"]}
          />
          <View style={{ width: 12 }} />
          <StatusCard
            label={t("home.temperature")}
            value="N/A"
            icon="thermometer"
            accentColor="#F87171"
            gradientColors={["#1E40AF", "#1D4ED8", "#6C63FF"]}
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
    const isWarning = item.icon === "warning-outline";
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
      <FlatList
        data={recentActions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={() => <View style={{ height: 32 }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
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

  /* Metrics strip */
  metricsStrip: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 16,
    gap: 8,
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
});
