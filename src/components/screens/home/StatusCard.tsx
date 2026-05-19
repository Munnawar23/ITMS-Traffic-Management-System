import { theme, useAppTheme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatusCardProps {
  label: string;
  value: string;
  icon: any;
  valueColor?: string;
  accentColor?: string;
  gradientColors?: readonly [string, string, ...string[]];
  isPulsing?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  label,
  value,
  icon,
  valueColor,
  accentColor,
  gradientColors,
  isPulsing = false,
}) => {
  const { colors: appColors } = useAppTheme();

  const finalValueColor = valueColor ?? "#FFFFFF";
  const finalAccentColor = accentColor ?? appColors.accent;

  const defaultGradient: readonly [string, string] = [
    appColors.primary + "CC",
    appColors.background === "#0F172A" ? "#1E293BCC" : "#0F2463CC",
  ];
  const colors = gradientColors ?? defaultGradient;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Icon badge top-left */}
        <View style={[styles.iconBadge, { backgroundColor: finalAccentColor + "28" }]}>
          <Ionicons name={icon} size={17} color={finalAccentColor} />
        </View>

        {/* Label */}
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>

        {/* Value row */}
        <View style={styles.valueRow}>
          <Text
            style={[styles.value, { color: finalValueColor }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {value}
          </Text>
          {isPulsing && (
            <View style={[styles.pulseDot, { backgroundColor: finalAccentColor }]} />
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    padding: 16,
    minHeight: 110,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  value: {
    fontSize: 18,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#FFFFFF",
    flex: 1,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default StatusCard;
