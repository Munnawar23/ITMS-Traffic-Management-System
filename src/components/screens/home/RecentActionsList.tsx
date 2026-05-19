import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { CycleReportEntry } from "@/types/traffic";
import { theme, useAppTheme } from "@/styles/theme";

interface SectionHeaderProps {
  title: string;
  badgeLabel?: string;
  badgeIcon?: keyof typeof Ionicons.glyphMap;
}

function SectionHeader({ title, badgeLabel, badgeIcon }: SectionHeaderProps) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {badgeLabel ? (
        <View style={[styles.sectionBadge, { backgroundColor: colors.accent + "1A" }]}>
          {badgeIcon && <Ionicons name={badgeIcon} size={11} color={colors.accent} style={{ marginRight: 3 }} />}
          <Text style={[styles.sectionBadgeText, { color: colors.accent }]}>{badgeLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}

interface RecentActionsListProps {
  logs: CycleReportEntry[];
}

export default function RecentActionsList({ logs }: RecentActionsListProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  // Map live RPi5 database logs to dashboard action items
  const recentActions = [...logs]
    .reverse() // Sort newest first
    .slice(0, 4) // Limit to the most recent 4 cycles
    .map((item, idx) => {
      const laneNum = item.lane === "81" ? "1" : item.lane === "82" ? "2" : item.lane === "83" ? "3" : "4";
      const vehicleDesc = item.total_vehicles > 0 
        ? `${item.total_vehicles} vehicles detected` 
        : `No vehicles detected`;
      
      let iconName: keyof typeof Ionicons.glyphMap = "sync-outline";
      if (item.mode === "vip") iconName = "shield-checkmark-outline";
      if (item.mode === "yellow") iconName = "flash-outline";
      if (item.mode === "set_manual" || item.mode === "manual") iconName = "time-outline";

      return {
        id: `live_${idx}_${item.time}`,
        time: item.time.substring(0, 5), // Format HH:MM
        desc: `Lane ${laneNum} Green for ${item.green_duration}s (${vehicleDesc})`,
        icon: iconName,
      };
    });

  const renderItem = (item: typeof recentActions[0]) => {
    const isWarning = item.icon === "shield-checkmark-outline";
    const accent = isWarning ? "#F87171" : colors.accent;
    return (
      <View style={[styles.actionRow, { backgroundColor: colors.card }]} key={item.id}>
        {/* Left accent bar */}
        <View style={[styles.actionAccent, { backgroundColor: accent }]} />
        {/* Icon chip */}
        <View style={[styles.actionIconChip, { backgroundColor: accent + "18" }]}>
          <Ionicons name={item.icon} size={16} color={accent} />
        </View>
        {/* Text */}
        <View style={styles.actionText}>
          <Text style={[styles.actionDesc, { color: colors.text }]}>{item.desc}</Text>
          <View style={styles.actionMeta}>
            <Ionicons name="time-outline" size={11} color={colors.subtext} />
            <Text style={[styles.actionTime, { color: colors.subtext }]}>{item.time}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <SectionHeader
        title={t("home.recentActions")}
        badgeLabel={t("home.today")}
        badgeIcon="time-outline"
      />

      {recentActions.length === 0 ? (
        <View style={[styles.actionRowEmpty, { borderColor: colors.border, backgroundColor: colors.card + "60" }]}>
          <Ionicons name="sparkles-outline" size={16} color={colors.subtext} style={{ marginRight: 8 }} />
          <Text style={[styles.actionDescEmpty, { color: colors.subtext }]}>Waiting for physical traffic cycles...</Text>
        </View>
      ) : (
        recentActions.map((item) => renderItem(item))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.fontFamily.heading,
    color: theme.colors.text,
    letterSpacing: 0.3,
  },
  sectionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(108,99,255,0.08)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#6C63FF",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    overflow: "hidden",
    paddingVertical: 16,
    paddingRight: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  actionAccent: {
    width: 5,
    alignSelf: "stretch",
    borderRadius: 2.5,
    marginRight: 12,
  },
  actionIconChip: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionDesc: {
    fontSize: 15,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#111827",
    marginBottom: 6,
    lineHeight: 20,
  },
  actionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionTime: {
    fontSize: 13,
    fontFamily: theme.fontFamily.body,
    color: "#6B7280",
  },
  actionRowEmpty: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    paddingVertical: 18,
  },
  actionDescEmpty: {
    fontSize: 14,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#9CA3AF",
  },
});
