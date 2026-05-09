import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { theme } from "@/styles/theme";
import { useTranslation } from "react-i18next";
import ScreenHeader from "@/components/ScreenHeader";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import TopIndicator from "@/components/TopIndicator";

export default function ModeScreen() {
  const { t, i18n } = useTranslation();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      t("common.logout"),
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/login" as any);
          }
        }
      ]
    );
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TopIndicator />
      <ScreenHeader title={t("tabs.mode")} />
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("common.language")}</Text>
          <View style={styles.languageContainer}>
            <TouchableOpacity 
              style={[
                styles.languageOption, 
                i18n.language === "en" && styles.activeLanguage
              ]}
              onPress={() => changeLanguage("en")}
            >
              <Text style={[
                styles.languageText,
                i18n.language === "en" && styles.activeLanguageText
              ]}>{t("common.english")}</Text>
              {i18n.language === "en" && <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.languageOption, 
                i18n.language === "hi" && styles.activeLanguage
              ]}
              onPress={() => changeLanguage("hi")}
            >
              <Text style={[
                styles.languageText,
                i18n.language === "hi" && styles.activeLanguageText
              ]}>{t("common.hindi")}</Text>
              {i18n.language === "hi" && <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={styles.logoutText}>{t("common.logout")}</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  languageContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activeLanguage: {
    backgroundColor: theme.colors.primary + "05",
  },
  languageText: {
    fontSize: 16,
    fontFamily: theme.fontFamily.body,
    color: theme.colors.text,
  },
  activeLanguageText: {
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.primary,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    marginTop: "auto",
    marginBottom: 20,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#EF4444",
  },
});
