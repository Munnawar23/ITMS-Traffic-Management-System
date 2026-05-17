import Button from "@/components/common/Button";
import ProfileMenuItem from "@/components/common/ProfileMenuItem";
import TopIndicator from "@/components/common/TopIndicator";

import { useAuthStore } from "@/store/authStore";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        {/* Profile Info Card */}
        <View style={styles.headerCard}>
          <View style={styles.profileBasicInfo}>
            <View style={styles.avatarCircle}>
              {user?.profile_picture ? (
                <Image
                  source={{ uri: user.profile_picture }}
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons
                  name="person"
                  size={36}
                  color={theme.colors.primary}
                />
              )}
            </View>
            <View style={styles.nameSection}>
              <Text style={styles.userName}>{user?.name || "Jawan Name"}</Text>
              <View style={styles.societyBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.societyText}>
                  {user?.badgeNumber || "ITMS-9988"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactInfoSection}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="ribbon"
                  size={18}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Designation</Text>
                <Text style={styles.infoValue}>{user?.role || "Jawan"}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="call" size={18} color={theme.colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Contact Number</Text>
                <Text style={styles.infoValue}>
                  {user?.phone_number || "9999999999"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content Section */}
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

          {/* Logout Button */}
          <View style={styles.logoutContainer}>
            <Button
              title={t("profile.logout")}
              onPress={handleLogout}
              style={{ backgroundColor: "#EF4444" }}
              icon={<Ionicons name="log-out-outline" size={22} color="white" />}
            />
          </View>

          {/* Version Footer */}
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
  headerCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileBasicInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  nameSection: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 22,
    fontFamily: theme.fontFamily.heading,
    color: "#000000",
  },
  societyBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: theme.colors.primary + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  societyText: {
    marginLeft: 6,
    fontSize: 15,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 20,
  },
  contactInfoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#000000",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: theme.fontFamily["body-semibold"],
    color: "#000000",
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
