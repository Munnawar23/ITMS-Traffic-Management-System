import React from "react";
import { Alert, Linking, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Button from "@/components/common/Button";
import ProfileMenuItem from "@/components/screens/profile/ProfileMenuItem";
import TopIndicator from "@/components/common/TopIndicator";
import { theme } from "@/styles/theme";
import { useAuthStore } from "@/store/authStore";
import ProfileHeaderCard from "@/components/screens/profile/ProfileHeaderCard";

export default function ProfileScreen() {
  const { user, logout, setLanguage } = useAuthStore();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const isHindi = i18n.language === "hi";

  const toggleLanguage = () => {
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TopIndicator />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Modular Profile Header Info Card */}
        <ProfileHeaderCard user={user} />

        {/* Content Settings Section */}
        <View style={styles.content}>
          <Text style={styles.sectionLabel}>
            {t("profile.languageSettings")}
          </Text>

          <View style={styles.card}>
            <ProfileMenuItem
              icon="language-outline"
              title={isHindi ? t("common.hindi") : t("common.english")}
              showBorder={false}
              rightElement={
                <View style={styles.languageToggle}>
                  <Text style={styles.languageCode}>
                    {isHindi ? "HI" : "EN"}
                  </Text>
                  <Switch
                    trackColor={{
                      false: "#dee2e6",
                      true: theme.colors.primary,
                    }}
                    thumbColor={isHindi ? "#ffffff" : "#f4f3f4"}
                    onValueChange={toggleLanguage}
                    value={isHindi}
                  />
                </View>
              }
            />
          </View>

          <Text style={styles.sectionLabel}>{t("profile.support")}</Text>

          <View style={styles.card}>
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
            <Text style={styles.versionText}>{t("profile.version")}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    color: "#000000",
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
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
