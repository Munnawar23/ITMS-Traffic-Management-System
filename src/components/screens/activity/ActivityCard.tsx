import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { CycleReportEntry } from "@/types/traffic";
import { theme, useAppTheme } from "@/styles/theme";

interface ActivityCardProps {
  item: CycleReportEntry;
}

export default function ActivityCard({ item }: ActivityCardProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  const getLaneLabel = (laneId: string) => {
    switch (laneId) {
      case "81":
        return t("mode.lane1", "Lane 1");
      case "82":
        return t("mode.lane2", "Lane 2");
      case "83":
        return t("mode.lane3", "Lane 3");
      case "84":
        return t("mode.lane4", "Lane 4");
      default:
        return `${t("mode.lane", "Lane")} ${laneId}`;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "auto":
        return "AI Jump";
      case "cycle_auto":
        return "AI Cycle";
      case "set_manual":
      case "manual":
        return "Scheduled";
      case "yellow":
        return "Blinker";
      case "vip":
        return "VIP Override";
      default:
        return mode;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "vip":
        return "#EF4444";
      case "auto":
      case "cycle_auto":
        return "#10B981";
      case "yellow":
        return "#F59E0B";
      default:
        return "#6C63FF";
    }
  };

  const modeColor = getModeColor(item.mode);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Top Header Row */}
      <View style={styles.cardHeader}>
        <View style={styles.laneContainer}>
          <View style={[styles.statusDot, { backgroundColor: modeColor }]} />
          <Text style={[styles.laneText, { color: colors.text }]}>{getLaneLabel(item.lane)}</Text>
        </View>
        <View style={[styles.durationBadge, { borderColor: modeColor + "30" }]}>
          <Ionicons name="time-outline" size={13} color={modeColor} style={{ marginRight: 3 }} />
          <Text style={[styles.durationText, { color: modeColor }]}>
            {item.green_duration}s
          </Text>
        </View>
      </View>

      {/* Info row */}
      <View style={styles.infoRow}>
        <Text style={[styles.modeText, { color: colors.text }]}>{getModeLabel(item.mode)}</Text>
        <Text style={[styles.timeText, { color: colors.text }]}>{item.time}</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* YOLO Vehicle Count Grid */}
      <View style={styles.vehiclesContainer}>
        <View style={styles.vehicleHeader}>
          <Ionicons name="eye-outline" size={13} color={colors.text} style={{ marginRight: 4 }} />
          <Text style={[styles.vehicleTitle, { color: colors.text }]}>
            {t("activity.detected", "YOLO Detections")}: {item.total_vehicles}
          </Text>
        </View>
        
        <View style={styles.badgeRow}>
          {item.car > 0 && (
            <View style={[styles.vehicleBadge, { backgroundColor: colors.background }]}>
              <Ionicons name="car-outline" size={12} color={colors.text} style={{ marginRight: 3 }} />
              <Text style={[styles.badgeText, { color: colors.text }]}>{item.car} Cars</Text>
            </View>
          )}
          {item.motorcycle > 0 && (
            <View style={[styles.vehicleBadge, { backgroundColor: colors.background }]}>
              <Ionicons name="bicycle-outline" size={12} color={colors.text} style={{ marginRight: 3 }} />
              <Text style={[styles.badgeText, { color: colors.text }]}>{item.motorcycle} Bikes</Text>
            </View>
          )}
          {item.bus > 0 && (
            <View style={[styles.vehicleBadge, { backgroundColor: colors.background }]}>
              <Ionicons name="bus-outline" size={12} color={colors.text} style={{ marginRight: 3 }} />
              <Text style={[styles.badgeText, { color: colors.text }]}>{item.bus} Buses</Text>
            </View>
          )}
          {item.truck > 0 && (
            <View style={[styles.vehicleBadge, { backgroundColor: colors.background }]}>
              <Ionicons name="trending-up-outline" size={12} color={colors.text} style={{ marginRight: 3 }} />
              <Text style={[styles.badgeText, { color: colors.text }]}>{item.truck} Trucks</Text>
            </View>
          )}
          {item.total_vehicles === 0 && (
            <Text style={[styles.noVehicles, { color: colors.text }]}>No vehicles detected in this cycle</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  laneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  laneText: {
    fontSize: 16,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#000000",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  durationText: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-semibold"],
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  modeText: {
    fontSize: 13,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#000000",
  },
  timeText: {
    fontSize: 12,
    fontFamily: theme.fontFamily.body,
    color: "#000000",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  vehiclesContainer: {
    gap: 8,
  },
  vehicleHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  vehicleTitle: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#000000",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  vehicleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#000000",
  },
  noVehicles: {
    fontSize: 12,
    fontFamily: theme.fontFamily.body,
    color: "#000000",
    fontStyle: "italic",
  },
});
