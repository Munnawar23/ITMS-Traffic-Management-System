import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "@/styles/theme";
import { useTranslation } from "react-i18next";
import ScreenHeader from "@/components/ScreenHeader";
import EmptyState from "@/components/EmptyState";
import { SafeAreaView } from "react-native-safe-area-context";
import TopIndicator from "@/components/TopIndicator";

export default function ActivityScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TopIndicator />
      <ScreenHeader title={t("tabs.activity")} />
      <View style={styles.content}>
        <EmptyState 
          title={t("activity.noActivity")} 
          subtitle={t("activity.noActivityDesc")} 
          lottieSource={require("@/assets/animations/light.json")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
