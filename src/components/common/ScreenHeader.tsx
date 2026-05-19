import React from "react";
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme, useAppTheme } from "@/styles/theme";
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
  const { colors } = useAppTheme();
  
  const handleRefresh = async () => {
    if (onRefresh) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await onRefresh();
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>{title}</Text>
        </View>

        {onRefresh && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleRefresh}
            disabled={isLoading}
            style={[styles.refreshButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="refresh-outline" size={22} color={colors.primary} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {subtitle && (
        <Text style={[styles.headerSubtitle, { color: colors.subtext }]} numberOfLines={1}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp(5),
    paddingTop: hp(1.5),
    paddingBottom: hp(0.8),
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
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: theme.fontFamily.body,
    marginTop: 4,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
