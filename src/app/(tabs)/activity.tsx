import EmptyState from "@/components/EmptyState";
import TopIndicator from "@/components/TopIndicator";
import { theme } from "@/styles/theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TopIndicator />
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
