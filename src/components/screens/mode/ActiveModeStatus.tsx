import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { ModeOption } from "@/constants";
import { theme } from "@/styles/theme";
import { wp, hp } from "@/helpers";

interface ActiveModeStatusProps {
  active: ModeOption;
}

export default function ActiveModeStatus({ active }: ActiveModeStatusProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.activeModeCard}>
      {/* Subtle background gradient or active border accent */}
      <View style={[styles.activeAccentBar, { backgroundColor: active.accent }]} />
      
      <View style={styles.activeCardContent}>
        {/* Left: Large glowing icon box */}
        <View
          style={[
            styles.activeIconContainer,
            { backgroundColor: active.accent + "12", borderColor: active.accent + "25" },
          ]}
        >
          {/* Semi-transparent pulsing-like rings */}
          <View style={[styles.activeIconRing, { borderColor: active.accent + "18" }]}>
            <Ionicons name={active.icon} size={28} color={active.accent} />
          </View>
        </View>

        {/* Right: Info */}
        <View style={styles.activeTextContainer}>
          <View style={styles.activeTagRow}>
            <Text style={[styles.activeTag, { color: active.accent }]}>
              {t("mode.activeControl")}
            </Text>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDotPulse} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <Text style={styles.activeModeTitle}>
            {t(`mode.${active.key}`)}
          </Text>
          
          <Text style={styles.activeModeDesc}>
            {active.description}. Optimizing traffic flow dynamically for the active junction.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeModeCard: {
    marginHorizontal: wp(4),
    marginTop: hp(3),
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    position: "relative",
  },
  activeAccentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  activeCardContent: {
    flexDirection: "row",
    padding: wp(4.5),
    alignItems: "center",
    gap: wp(4),
  },
  activeIconContainer: {
    width: wp(16),
    height: wp(16),
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  activeIconRing: {
    width: wp(12),
    height: wp(12),
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  activeTextContainer: {
    flex: 1,
  },
  activeTagRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  activeTag: {
    fontSize: 9,
    fontFamily: theme.fontFamily["body-semibold"],
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  liveDotPulse: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#10B981",
  },
  liveText: {
    fontSize: 9,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#059669",
    letterSpacing: 0.5,
  },
  activeModeTitle: {
    fontSize: 18,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
    marginBottom: 4,
  },
  activeModeDesc: {
    fontSize: 12,
    fontFamily: theme.fontFamily.body,
    color: "#64748B",
    lineHeight: 18,
  },
});
