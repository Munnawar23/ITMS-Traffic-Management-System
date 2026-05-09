import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "@/styles/theme";
import { useTranslation } from "react-i18next";
import ScreenHeader from "@/components/ScreenHeader";
import TopIndicator from "@/components/TopIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getGreeting, formatDate } from "@/utils/dateUtils";

export default function HomeScreen() {
  const { t } = useTranslation();
  const greeting = getGreeting(t);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <TopIndicator />
      <ScreenHeader 
        title={greeting} 
        rightIcon={
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        }
      />
      <View style={styles.content}>
        <Text style={styles.text}>ITMS Dashboard</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontFamily: theme.fontFamily["body-semibold"],
    color: theme.colors.text,
  },
});
