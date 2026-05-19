import React from "react";
import { Alert, Linking, ScrollView, StyleSheet, Switch, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Button from "@/components/common/Button";
import ProfileMenuItem from "@/components/screens/profile/ProfileMenuItem";
import TopIndicator from "@/components/common/TopIndicator";
import { theme, useAppTheme } from "@/styles/theme";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/useThemeStore";
import ProfileHeaderCard from "@/components/screens/profile/ProfileHeaderCard";
import * as Haptics from "expo-haptics";

export default function ProfileScreen() {
  const { user, logout, setLanguage } = useAuthStore();
  const { themeMode, setThemeMode } = useThemeStore();
  const { colors } = useAppTheme();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const isHindi = i18n.language === "hi";

  const toggleLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const nextLanguage = isHindi ? "en" : "hi";
    i18n.changeLanguage(nextLanguage);
    setLanguage(nextLanguage);
  };

  const handleLogout = () => {
    Alert.alert(
      t("profile.logoutConfirmTitle"),
      t("profile.logoutConfirmMsg"),
      [
        { text: t("profile.cancel"), style: "cancel" },
        {
          text: t("profile.logout"),
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/login" as any);
          },
        },
      ],
    );
  };

  const handleContactUs = () => {
    Linking.openURL("tel:7014102656");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <TopIndicator />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Modular Profile Header Info Card */}
        <ProfileHeaderCard user={user} />

        {/* Content Settings Section */}
        <View style={styles.content}>
          <Text style={[styles.sectionLabel, { color: colors.text }]}>
            {t("profile.languageSettings")}
          </Text>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ProfileMenuItem
              icon="language-outline"
              title={isHindi ? t("common.hindi") : t("common.english")}
              showBorder={false}
              rightElement={
                <View style={styles.languageToggle}>
                  <Text style={[styles.languageCode, { color: colors.text }]}>
                    {isHindi ? "HI" : "EN"}
                  </Text>
                  <Switch
                    trackColor={{
                      false: "#dee2e6",
                      true: colors.primary,
                    }}
                    thumbColor={isHindi ? "#ffffff" : "#f4f3f4"}
                    onValueChange={toggleLanguage}
                    value={isHindi}
                  />
                </View>
              }
            />
          </View>

          {/* Theme Settings Section (3 Selectable Widgets) */}
          <Text style={[styles.sectionLabel, { color: colors.text }]}>
            {t("profile.themeSettings", "Theme Mode")}
          </Text>

          <View style={styles.themeRow}>
            {(["system", "light", "dark"] as const).map((mode) => {
              const isSelected = themeMode === mode;
              let iconName: any = "desktop-outline";
              let modeName = t("profile.themeSystem", "System");
              if (mode === "light") {
                iconName = "sunny-outline";
                modeName = t("profile.themeLight", "Light");
              } else if (mode === "dark") {
                iconName = "moon-outline";
                modeName = t("profile.themeDark", "Dark");
              }

              return (
                <TouchableOpacity
                  key={mode}
                  activeOpacity={0.7}
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setThemeMode(mode);
                  }}
                  style={[
                    styles.themeWidget,
                    { 
                      backgroundColor: isSelected ? colors.primary : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border
                    }
                  ]}
                >
                  <Ionicons 
                    name={iconName} 
                    size={18} 
                    color={isSelected ? "#FFFFFF" : colors.text} 
                    style={{ marginBottom: 6 }} 
                  />
                  <Text style={[
                    styles.themeWidgetText, 
                    { color: isSelected ? "#FFFFFF" : colors.text }
                  ]}>
                    {modeName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.text }]}>{t("profile.support")}</Text>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <ProfileMenuItem
              icon="call-outline"
              title={t("profile.contactUs")}
              onPress={handleContactUs}
              showBorder={false}
            />
          </View>

          {/* Logout Action Button */}
          <View style={styles.logoutContainer}>
            <Button
              title={t("profile.logout")}
              onPress={handleLogout}
              style={{ backgroundColor: "#EF4444" }}
              icon={<Ionicons name="log-out-outline" size={22} color="white" />}
            />
          </View>

          {/* Version Footer Label */}
          <View style={styles.footer}>
            <Text style={[styles.versionText, { color: colors.subtext }]}>{t("profile.version")}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-semibold"],
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    borderRadius: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  languageToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  languageCode: {
    marginRight: 8,
    fontSize: 14,
    fontFamily: theme.fontFamily["body-medium"],
  },
  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 24,
  },
  themeWidget: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  themeWidgetText: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-medium"],
  },
  logoutContainer: {
    marginTop: 16,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  versionText: {
    fontSize: 12,
    fontFamily: theme.fontFamily.body,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
