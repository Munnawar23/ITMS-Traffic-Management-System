import { getProfileApi, loginApi } from "@/api/login";
import Button from "@/components/common/Button";
import TopIndicator from "@/components/common/TopIndicator";
import { useAuthStore } from "@/store/authStore";
import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  };

  const handleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!validateEmail(email)) {
      Alert.alert(
        t("login.validation.invalidEmail"),
        t("login.validation.invalidEmailMsg"),
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        t("login.validation.invalidPassword"),
        t("login.validation.invalidPasswordMsg"),
      );
      return;
    }

    setLoading(true);
    try {
      const loginData = { email: email.trim(), password };
      const loginResponse = await loginApi(loginData);

      if (loginResponse.access_token) {
        const token = loginResponse.access_token;
        const userData = await getProfileApi();
        setAuth(token, userData);
        router.replace("/home" as any);
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      Alert.alert(t("login.validation.error"), errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraHeight={200}
        extraScrollHeight={200}
        keyboardShouldPersistTaps="handled"
      >
        <TopIndicator />

        <View style={styles.innerContainer}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Image
                source={require("@/assets/images/policeman.png")}
                style={styles.logoImage}
                contentFit="contain"
                transition={1000}
              />
            </View>
            <Text style={styles.title}>{t("login.title")}</Text>
            <View style={styles.subtitleContainer}>
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color={theme.colors.primary}
              />
              <Text style={styles.subtitleText}>{t("login.subtitle")}</Text>
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formCard}>
            <Text style={styles.welcomeText}>{t("login.welcome")}</Text>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t("login.email")}</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused ? styles.inputWrapperFocused : null,
                ]}
              >
                <View
                  style={[
                    styles.iconBox,
                    emailFocused ? styles.iconBoxFocused : null,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color={emailFocused ? "#ffffff" : "#000000"}
                  />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder={t("login.emailPlaceholder")}
                  placeholderTextColor="#adb5bd"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t("login.password")}</Text>
              <View
                style={[
                  styles.inputWrapper,
                  passwordFocused ? styles.inputWrapperFocused : null,
                ]}
              >
                <View
                  style={[
                    styles.iconBox,
                    passwordFocused ? styles.iconBoxFocused : null,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={16}
                    color={passwordFocused ? "#ffffff" : "#000000"}
                  />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder={t("login.passwordPlaceholder")}
                  placeholderTextColor="#adb5bd"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#000000"
                  />
                </Pressable>
              </View>
            </View>

            <Button
              title={t("login.signIn")}
              onPress={handleLogin}
              loading={loading}
              style={{ marginTop: 8 }}
              icon={
                <Ionicons
                  name="arrow-forward-outline"
                  size={18}
                  color="white"
                />
              }
            />
          </View>

          {/* Help Section */}
          <View style={styles.helpSection}>
            <View style={styles.helpHeader}>
              <View style={styles.helpDivider} />
              <Text style={styles.helpTitle}>{t("login.help")}</Text>
              <View style={styles.helpDivider} />
            </View>
            <Pressable style={styles.helpLink}>
              <Text style={styles.helpText}>
                {t("login.trouble")}{" "}
                <Text style={styles.helpLinkBold}>
                  {t("login.contactAdmin")}
                </Text>
              </Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.versionText}>{t("profile.version")}</Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 40,
    fontFamily: theme.fontFamily.heading,
    color: theme.colors.text,
    letterSpacing: -1,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: theme.fontFamily["body-medium"],
    color: theme.colors.subtext,
    marginLeft: 6,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 18,
    fontFamily: theme.fontFamily["body-semibold"],
    textAlign: "center",
    color: theme.colors.text,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: "#F9FAFB",
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: "#ffffff",
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  iconBoxFocused: {
    backgroundColor: theme.colors.primary,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: theme.fontFamily["body-medium"],
    color: theme.colors.text,
  },
  eyeButton: {
    padding: 4,
  },
  helpSection: {
    marginTop: 32,
    alignItems: "center",
  },
  helpHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  helpDivider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  helpTitle: {
    marginHorizontal: 16,
    color: theme.colors.subtext,
    fontFamily: theme.fontFamily.body,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  helpLink: {
    paddingVertical: 8,
  },
  helpText: {
    color: theme.colors.text,
    fontFamily: theme.fontFamily.body,
    fontSize: 16,
    textAlign: "center",
  },
  helpLinkBold: {
    color: theme.colors.primary,
    fontFamily: theme.fontFamily["body-semibold"],
  },
  footer: {
    marginTop: "auto",
    paddingTop: 24,
    alignItems: "center",
  },
  versionText: {
    fontSize: 12,
    fontFamily: theme.fontFamily.body,
    color: theme.colors.subtext,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
