import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ModeOption } from "@/constants";
import { theme } from "@/styles/theme";
import { wp, hp } from "@/helpers";

interface ModeCardProps {
  mode: ModeOption;
  isActive: boolean;
  label: string;
  description: string;
  onPress: () => void;
}

export default function ModeCard({
  mode,
  isActive,
  label,
  description,
  onPress,
}: ModeCardProps) {
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

      {/* Top Row: Icon & Status Dot/Badge */}
      <View style={styles.cardHeader}>
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
            size={20}
            color={isActive ? "#FFFFFF" : mode.accent}
          />
        </View>

        {/* Small Active indicator/badge */}
        <View
          style={[
            styles.cardPill,
            isActive
              ? styles.cardPillActive
              : { backgroundColor: "#F1F5F9", borderColor: "#E2E8F0" },
          ]}
        >
          <View style={[styles.pillDot, !isActive && { backgroundColor: "#CBD5E1" }]} />
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
      </View>

      {/* Bottom Block: Labels */}
      <View style={styles.cardBody}>
        <Text
          numberOfLines={1}
          style={[
            styles.cardLabel,
            { color: isActive ? "#FFFFFF" : theme.colors.text },
          ]}
        >
          {label}
        </Text>
        <Text
          numberOfLines={2}
          style={[
            styles.cardDesc,
            {
              color: isActive ? "rgba(255,255,255,0.75)" : "#64748B",
            },
          ]}
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modeCard: {
    width: "48%",
    aspectRatio: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: wp(4),
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  cardIconWrap: {
    width: wp(11),
    height: wp(11),
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  cardBody: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: hp(1),
  },
  cardLabel: {
    fontSize: 15,
    fontFamily: theme.fontFamily["body-semibold"],
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  cardDesc: {
    fontSize: 11,
    fontFamily: theme.fontFamily.body,
    lineHeight: 15,
  },
  cardPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.4),
    borderRadius: 12,
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
});
