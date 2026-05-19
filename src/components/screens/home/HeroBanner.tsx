import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { theme, useAppTheme } from "@/styles/theme";
import { getGreeting } from "@/utils/dateUtils";

interface HeroBannerProps {
  firstName: string;
  initial: string;
  dateStr: string;
}

export default function HeroBanner({ firstName, initial, dateStr }: HeroBannerProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.textColumn}>
        {/* Date Pill */}
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.primary }]}>{dateStr}</Text>
        </View>
        
        {/* Greeting & Name */}
        <Text style={[styles.greeting, { color: colors.subtext }]}>
          {getGreeting(t)} 👋
        </Text>
        <Text style={[styles.name, { color: colors.text }]}>
          {firstName}
        </Text>
      </View>

      {/* Avatar Ring */}
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={() => router.push("/profile")}
        style={[styles.avatarRing, { borderColor: colors.primary + "30" }]}
      >
        <View style={[styles.avatar, { backgroundColor: colors.primary + "15" }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>{initial}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  textColumn: {
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    fontFamily: theme.fontFamily["body-semibold"],
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  greeting: {
    fontSize: 16,
    fontFamily: theme.fontFamily.body,
    marginBottom: 2,
  },
  name: {
    fontSize: 32,
    fontFamily: theme.fontFamily.heading,
  },
  avatarRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontFamily: theme.fontFamily.heading,
  },
});
