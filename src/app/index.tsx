import { useAuthStore } from "@/store/authStore";
import { useAppTheme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const { colors } = useAppTheme();

  useEffect(() => {
    console.log("[ITMS SPLASH] Component mounted. Token status:", !!token);
    const timer = setTimeout(() => {
      try {
        if (token) {
          console.log("[ITMS SPLASH] Attempting to route to /home");
          router.replace("/home" as any);
        } else {
          console.log("[ITMS SPLASH] Attempting to route to /login");
          router.replace("/login" as any);
        }
      } catch (err: any) {
        console.error(
          "[ITMS SPLASH] router.replace failed:",
          err.message || err,
        );
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [token, router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {Platform.OS === "web" ? (
        <View style={styles.webContainer}>
          <Ionicons name="shield-checkmark" size={80} color="#ffffff" />
          <ActivityIndicator
            size="large"
            color="#ffffff"
            style={{ marginTop: 24 }}
          />
        </View>
      ) : (
        <LottieView
          source={require("@/assets/animations/splash.json")}
          autoPlay
          speed={1}
          loop={true}
          style={styles.lottie}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  webContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: "70%",
    aspectRatio: 1,
  },
});
