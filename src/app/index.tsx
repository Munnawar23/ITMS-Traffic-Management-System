import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { theme } from "@/styles/theme";

export default function SplashScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        // Navigate to home/tabs if logged in
        router.replace("/home" as any);
      } else {
        // Navigate to login if not logged in
        router.replace("/login" as any);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [token]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require("@/assets/animations/splash.json")}
        autoPlay
        speed={1}
        loop={true}
        style={styles.lottie}
      />
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
  lottie: {
    width: "70%",
    aspectRatio: 1,
  },
});
