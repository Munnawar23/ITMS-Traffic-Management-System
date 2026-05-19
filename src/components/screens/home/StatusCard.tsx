import { theme, useAppTheme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface StatusCardProps {
  label: string;
  value: string;
  icon: any;
  valueColor?: string;
  accentColor?: string;
  gradientColors?: readonly [string, string, ...string[]]; // Unused to maintain theme consistency
  isPulsing?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  label,
  value,
  icon,
  valueColor,
  accentColor,
  isPulsing = false,
}) => {
  const { colors, isDark } = useAppTheme();

  // Elegant Tech Blue gradients matching the high-end professional theme
  const gradient = isDark
    ? (["#121B32", "#080F20"] as const)  // Deep midnight blue card bg
    : (["#FFFFFF", "#F0F4F8"] as const); // Crisp light cobalt/slate-blue gradient

  const cardBorderColor = colors.border;
  const labelColor = colors.subtext;
  const valueTextColor = valueColor ?? colors.text;
  const iconColor = colors.primary;
  const iconBg = isDark ? "rgba(96, 165, 250, 0.08)" : "rgba(37, 99, 235, 0.06)";

  return (
    <View style={[styles.wrapper, { borderColor: cardBorderColor, shadowColor: isDark ? "#000000" : "#2563EB" }]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          {/* Elegant Tinted Icon Badge */}
          <View style={[styles.iconBox, { backgroundColor: iconBg, borderColor: colors.border }]}>
            <Ionicons name={icon} size={20} color={iconColor} />
          </View>
          {isPulsing && (
            <View style={[styles.pulseDot, { backgroundColor: "#10B981" }]} />
          )}
        </View>

        <View style={styles.bottomRow}>
          {/* Clean typography details */}
          <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
            {label}
          </Text>
          <Text
            style={[styles.value, { color: valueTextColor }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {value}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    padding: 16,
    minHeight: 120,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  bottomRow: {
    marginTop: 16,
  },
  label: {
    fontSize: 11,
    fontFamily: theme.fontFamily["body-semibold"],
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontFamily: theme.fontFamily.heading,
  },
});

export default StatusCard;
