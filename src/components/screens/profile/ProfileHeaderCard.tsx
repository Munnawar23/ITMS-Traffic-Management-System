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
  const { isDark } = useAppTheme();

  // Premium professional gradients based on theme mode
  const gradientColors = isDark
    ? (["#1E40AF", "#172554"] as const) // Deep indigo/blue for dark mode
    : (["#3B82F6", "#1D4ED8"] as const); // Vibrant blue for light mode

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientWrapper}
      >
        {/* Subtle overlay for texture */}
        <View style={styles.patternOverlay} />

        <View style={styles.cardBody}>
          {/* Avatar Area with Glassmorphism Ring */}
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarInner}>
              {user?.profile_picture ? (
                <Image source={{ uri: user.profile_picture }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={44} color={gradientColors[0]} />
              )}
            </View>
            {/* Active Status Indicator */}
            <View style={styles.statusDot} />
          </View>

          {/* Name and Role (White Text to pop on gradient) */}
          <Text style={styles.userName} numberOfLines={1}>
            {user?.name || "Jawan Name"}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText} numberOfLines={1}>
              {user?.role || "Jawan"}
            </Text>
          </View>

          {/* Widgets Row (Glassmorphism Effect) */}
          <View style={styles.widgetsRow}>
            {/* Badge Widget */}
            <View style={styles.widget}>
              <View style={styles.widgetIconWrapper}>
                <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.widgetLabel} numberOfLines={1}>
                Badge No.
              </Text>
              <Text style={styles.widgetValue} numberOfLines={1} adjustsFontSizeToFit>
                {user?.badgeNumber || "ITMS-9988"}
              </Text>
            </View>

            {/* Phone Widget */}
            <View style={styles.widget}>
              <View style={styles.widgetIconWrapper}>
                <Ionicons name="call" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.widgetLabel} numberOfLines={1}>
                Contact
              </Text>
              <Text style={styles.widgetValue} numberOfLines={1} adjustsFontSizeToFit>
                {user?.phone_number || "9999999999"}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 28,
    shadowColor: "#3B82F6", // Tinted shadow matching the gradient vibe
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
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
    backgroundColor: "rgba(255, 255, 255, 0.25)", // Glass border
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
    borderColor: "rgba(255, 255, 255, 0.5)", // Blends beautifully with glass border
  },
  userName: {
    fontSize: 26,
    fontFamily: theme.fontFamily.heading,
    marginBottom: 6,
    textAlign: "center",
    color: "#FFFFFF",
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 28,
  },
  roleText: {
    fontSize: 13,
    fontFamily: theme.fontFamily["body-semibold"],
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#FFFFFF",
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
    backgroundColor: "rgba(255, 255, 255, 0.12)", // Glassmorphism panel
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "flex-start",
  },
  widgetIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  widgetLabel: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-medium"],
    marginBottom: 4,
    color: "rgba(255, 255, 255, 0.7)",
  },
  widgetValue: {
    fontSize: 16,
    fontFamily: theme.fontFamily["body-semibold"],
    width: "100%",
    color: "#FFFFFF",
  },
});
