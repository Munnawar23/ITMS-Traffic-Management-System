import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { theme } from "@/styles/theme";
import { getGreeting } from "@/utils/dateUtils";

interface HeroBannerProps {
  firstName: string;
  initial: string;
  dateStr: string;
}

export default function HeroBanner({ firstName, initial, dateStr }: HeroBannerProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.heroWrap}>
      <LinearGradient
        colors={["#1E40AF", "#1D4ED8", "#6C63FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBg}
      >
        {/* Decorative background blobs */}
        <View style={styles.blob1} />
        <View style={styles.blob2} />
        <View style={styles.blob3} />

        {/* Top greeting row */}
        <View style={styles.heroTop}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroGreeting}>
              {getGreeting(t)} 👋
            </Text>
            <Text style={styles.heroName}>{firstName}</Text>
          </View>

          {/* User circular avatar icon */}
          <LinearGradient
            colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"]}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </LinearGradient>
        </View>

        {/* Horizontal Divider */}
        <View style={styles.heroDivider} />

        {/* Bottom row: calendar pill & live indicator */}
        <View style={styles.heroBottom}>
          <View style={styles.heroPill}>
            <Ionicons name="calendar-outline" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.heroPillText}>{dateStr}</Text>
          </View>

          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveLabel}>LIVE</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 6,
    borderRadius: 26,
    overflow: "hidden",
    elevation: 14,
    shadowColor: "#1E40AF",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
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
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    top: -90,
    right: -40,
  },
  blob2: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    bottom: -60,
    left: -20,
  },
  blob3: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    top: 60,
    left: 120,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLeft: {
    flex: 1,
  },
  heroGreeting: {
    fontSize: 14,
    fontFamily: theme.fontFamily.body,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 3,
  },
  heroName: {
    fontSize: 24,
    fontFamily: theme.fontFamily.heading,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  avatarText: {
    fontSize: 18,
    fontFamily: theme.fontFamily.heading,
    color: "#FFFFFF",
  },
  heroDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
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
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  heroPillText: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#FFFFFF",
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16,185,129,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(52,211,153,0.25)",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  liveLabel: {
    fontSize: 11,
    fontFamily: theme.fontFamily.heading,
    color: "#34D399",
    letterSpacing: 0.8,
  },
});
