import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

import EmptyState from "@/components/common/EmptyState";
import TopIndicator from "@/components/common/TopIndicator";
import { theme } from "@/styles/theme";
import { useTrafficStore } from "@/store/useTrafficStore";
import { CycleReportEntry } from "@/types/traffic";
import { wp, hp } from "@/helpers";

export default function ActivityScreen() {
  const { t } = useTranslation();
  const { logs, isLoading, fetchLogs } = useTrafficStore();
  const [refreshing, setRefreshing] = useState(false);

  // Load today's logs on mount
  useEffect(() => {
    console.log(`[📊 ACTIVITY SCREEN] Component mounted. Triggering initial daily logs fetch...`);
    fetchLogs();
  }, [fetchLogs]);

  // Pull to refresh handler
  const handleRefresh = async () => {
    console.log(`[📊 ACTIVITY SCREEN] 🔄 User triggered pull-to-refresh.`);
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
    console.log(`[📊 ACTIVITY SCREEN] 🔄 Refresh completed.`);
  };

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

  const renderItem = ({ item }: { item: CycleReportEntry }) => {
    const modeColor = getModeColor(item.mode);

    return (
      <View style={styles.card}>
        {/* Top Header Row */}
        <View style={styles.cardHeader}>
          <View style={styles.laneContainer}>
            <View style={[styles.statusDot, { backgroundColor: modeColor }]} />
            <Text style={styles.laneText}>{getLaneLabel(item.lane)}</Text>
          </View>
          <View style={[styles.durationBadge, { borderColor: modeColor + "30" }]}>
            <Ionicons name="time-outline" size={13} color={modeColor} />
            <Text style={[styles.durationText, { color: modeColor }]}>
              {item.green_duration}s
            </Text>
          </View>
        </View>

        {/* Info row */}
        <View style={styles.infoRow}>
          <Text style={styles.modeText}>{getModeLabel(item.mode)}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        <View style={styles.divider} />

        {/* YOLO Vehicle Count Grid */}
        <View style={styles.vehiclesContainer}>
          <View style={styles.vehicleHeader}>
            <Ionicons name="eye-outline" size={13} color="#64748B" />
            <Text style={styles.vehicleTitle}>
              {t("activity.detected", "YOLO Detections")}: {item.total_vehicles}
            </Text>
          </View>
          
          <View style={styles.badgeRow}>
            {item.car > 0 && (
              <View style={styles.vehicleBadge}>
                <Ionicons name="car-outline" size={12} color="#475569" />
                <Text style={styles.badgeText}>{item.car} Cars</Text>
              </View>
            )}
            {item.motorcycle > 0 && (
              <View style={styles.vehicleBadge}>
                <Ionicons name="bicycle-outline" size={12} color="#475569" />
                <Text style={styles.badgeText}>{item.motorcycle} Bikes</Text>
              </View>
            )}
            {item.bus > 0 && (
              <View style={styles.vehicleBadge}>
                <Ionicons name="bus-outline" size={12} color="#475569" />
                <Text style={styles.badgeText}>{item.bus} Buses</Text>
              </View>
            )}
            {item.truck > 0 && (
              <View style={styles.vehicleBadge}>
                <Ionicons name="trending-up-outline" size={12} color="#475569" />
                <Text style={styles.badgeText}>{item.truck} Trucks</Text>
              </View>
            )}
            {item.total_vehicles === 0 && (
              <Text style={styles.noVehicles}>No vehicles detected in this cycle</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{t("activity.title", "Signal Activity Logs")}</Text>
      <Text style={styles.headerSubtitle}>
        {t("activity.subtitle", "Historical cycles from GEM controller")}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TopIndicator />

      {logs.length > 0 ? (
        <FlatList
          data={logs}
          keyExtractor={(item, index) => `${item.date}-${item.time}-${index}`}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isLoading}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isLoading}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          <EmptyState
            title={t("activity.noActivity", "No Activity Logged")}
            subtitle={t("activity.noActivityDesc", "No signal cycles recorded on Raspberry Pi for today.")}
            lottieSource={require("@/assets/animations/light.json")}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2.5),
    paddingBottom: hp(1.5),
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
    marginTop: 2,
  },
  listContent: {
    paddingBottom: hp(4),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginHorizontal: wp(5),
    marginBottom: hp(2),
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
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  laneText: {
    fontSize: 16,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#0F172A",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    color: "#475569",
  },
  timeText: {
    fontSize: 12,
    fontFamily: theme.fontFamily.body,
    color: "#94A3B8",
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
    gap: 4,
  },
  vehicleTitle: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#64748B",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  vehicleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#334155",
  },
  noVehicles: {
    fontSize: 12,
    fontFamily: theme.fontFamily.body,
    color: "#94A3B8",
    fontStyle: "italic",
  },
});
