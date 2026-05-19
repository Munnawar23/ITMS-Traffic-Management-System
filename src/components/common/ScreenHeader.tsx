import React from "react";
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "@/styles/theme";
import { wp, hp } from "@/helpers";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void | Promise<void>;
  isLoading?: boolean;
}

export default function ScreenHeader({
  title,
  subtitle,
  onRefresh,
  isLoading = false,
}: ScreenHeaderProps) {
  const handleRefresh = async () => {
    if (onRefresh) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await onRefresh();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        </View>

        {onRefresh && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleRefresh}
            disabled={isLoading}
            style={styles.refreshButton}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Ionicons name="refresh-outline" size={22} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {subtitle && (
        <Text style={styles.headerSubtitle} numberOfLines={1}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp(5),
    paddingTop: hp(1.5), // Shunted a little bit up!
    paddingBottom: hp(0.8), // Tighter bottom padding
    backgroundColor: theme.colors.background,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: theme.fontFamily.body,
    color: "#64748B",
    marginTop: 4, // Perfect separation spacing
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 12, // Beautiful rounded square background!
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
