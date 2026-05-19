import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme, useAppTheme } from "@/styles/theme";

interface UserType {
  name?: string;
  badgeNumber?: string;
  profile_picture?: string;
  role?: string;
  phone_number?: string;
}

interface ProfileHeaderCardProps {
  user: UserType | null;
}

export default function ProfileHeaderCard({ user }: ProfileHeaderCardProps) {
  const { colors, isDark } = useAppTheme();

  // Cohesive Tech Blue style tokens matching the theme
  const textColor = colors.text;
  const subtextColor = colors.subtext;
  const cardBorderColor = colors.border;
  const glassBg = isDark ? "rgba(96, 165, 250, 0.05)" : "rgba(37, 99, 235, 0.03)";
  const glassBorder = colors.border;
  const avatarBorder = isDark ? "rgba(96, 165, 250, 0.15)" : "rgba(37, 99, 235, 0.1)";

  const cardBgColor = isDark ? "#121B32" : "#F0F4F8";

  return (
    <View style={[styles.cardContainer, { borderColor: cardBorderColor, shadowColor: isDark ? "#000000" : "#2563EB" }]}>
      <View style={[styles.gradientWrapper, { backgroundColor: cardBgColor }]}>
        {/* Subtle overlay for texture */}
        <View style={styles.patternOverlay} />

        <View style={styles.cardBody}>
          {/* Avatar Area with Elegant Border Ring */}
          <View style={[styles.avatarWrapper, { backgroundColor: avatarBorder }]}>
            <View style={styles.avatarInner}>
              {user?.profile_picture ? (
                <Image source={{ uri: user.profile_picture }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={44} color={textColor} />
              )}
            </View>
            {/* Active Status Indicator */}
            <View style={[styles.statusDot, { borderColor: cardBgColor }]} />
          </View>

          {/* Name and Role */}
          <Text style={[styles.userName, { color: textColor }]} numberOfLines={1}>
            {user?.name || "Jawan Name"}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: glassBg, borderColor: glassBorder }]}>
            <Text style={[styles.roleText, { color: textColor }]} numberOfLines={1}>
              {user?.role || "Jawan"}
            </Text>
          </View>

          {/* Widgets Row (Glassmorphism Effect) */}
          <View style={styles.widgetsRow}>
            {/* Badge Widget */}
            <View style={[styles.widget, { backgroundColor: glassBg, borderColor: glassBorder }]}>
              <View style={[styles.widgetIconWrapper, { backgroundColor: glassBg }]}>
                <Ionicons name="shield-checkmark" size={18} color={textColor} />
              </View>
              <Text style={[styles.widgetLabel, { color: subtextColor }]} numberOfLines={1}>
                Badge No.
              </Text>
              <Text style={[styles.widgetValue, { color: textColor }]} numberOfLines={1} adjustsFontSizeToFit>
                {user?.badgeNumber || "ITMS-9988"}
              </Text>
            </View>

            {/* Phone Widget */}
            <View style={[styles.widget, { backgroundColor: glassBg, borderColor: glassBorder }]}>
              <View style={[styles.widgetIconWrapper, { backgroundColor: glassBg }]}>
                <Ionicons name="call" size={18} color={textColor} />
              </View>
              <Text style={[styles.widgetLabel, { color: subtextColor }]} numberOfLines={1}>
                Contact
              </Text>
              <Text style={[styles.widgetValue, { color: textColor }]} numberOfLines={1} adjustsFontSizeToFit>
                {user?.phone_number || "9999999999"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 28,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6, // Great for Android
  },
  gradientWrapper: {
    borderRadius: 28,
    overflow: "hidden",
  },
  patternOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    backgroundColor: "#ffffff",
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: "center",
  },
  avatarWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#10B981", // Emerald green
    borderWidth: 3,
  },
  userName: {
    fontSize: 26,
    fontFamily: theme.fontFamily.heading,
    marginBottom: 6,
    textAlign: "center",
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 28,
  },
  roleText: {
    fontSize: 13,
    fontFamily: theme.fontFamily["body-semibold"],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  widgetsRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  widget: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  widgetIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  widgetLabel: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-medium"],
    marginBottom: 4,
  },
  widgetValue: {
    fontSize: 16,
    fontFamily: theme.fontFamily["body-semibold"],
    width: "100%",
  },
});
