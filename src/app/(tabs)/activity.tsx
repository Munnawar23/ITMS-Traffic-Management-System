import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/common/EmptyState";
import TopIndicator from "@/components/common/TopIndicator";
import ScreenHeader from "@/components/common/ScreenHeader";
import { theme, useAppTheme } from "@/styles/theme";
import { useTrafficStore } from "@/store/useTrafficStore";
import ActivityCard from "@/components/screens/activity/ActivityCard";
import { wp, hp } from "@/helpers";

export default function ActivityScreen() {
  const { t } = useTranslation();
  const { logs, isLoading, fetchLogs } = useTrafficStore();
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useAppTheme();

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

  const renderHeader = () => (
    <ScreenHeader
      title={t("activity.title", "Signal Activity Logs")}
      subtitle={t("activity.subtitle", "Historical cycles from GEM controller")}
      onRefresh={fetchLogs}
      isLoading={isLoading}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <TopIndicator />

      {logs.length > 0 ? (
        <FlatList
          data={logs}
          keyExtractor={(item, index) => `${item.date}-${item.time}-${index}`}
          renderItem={({ item }) => <ActivityCard item={item} />}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isLoading}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
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
              colors={[colors.primary]}
              tintColor={colors.primary}
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

  listContent: {
    paddingBottom: hp(4),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

});
