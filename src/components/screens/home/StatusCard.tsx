import { theme, useAppTheme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatusCardProps {
  label: string;
  value: string;
  icon: any;
  valueColor?: string;
  accentColor?: string;
  gradientColors?: readonly [string, string, ...string[]]; // Unused but kept for prop compatibility
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
  const { colors } = useAppTheme();

  const finalAccentColor = accentColor ?? colors.primary;
  const finalValueColor = valueColor ?? colors.text;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: finalAccentColor + "15" }]}>
          <Ionicons name={icon} size={20} color={finalAccentColor} />
        </View>
        {isPulsing && (
          <View style={[styles.pulseDot, { backgroundColor: finalAccentColor }]} />
        )}
      </View>

      <View style={styles.bottomRow}>
        <Text style={[styles.label, { color: colors.subtext }]} numberOfLines={1}>
          {label}
        </Text>
        <Text
          style={[styles.value, { color: finalValueColor }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {value}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
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
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  bottomRow: {
    marginTop: 16,
  },
  label: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-medium"],
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontFamily: theme.fontFamily.heading,
  },
});

export default StatusCard;
