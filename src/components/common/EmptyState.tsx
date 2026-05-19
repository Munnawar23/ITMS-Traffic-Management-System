import { theme, useAppTheme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon?: string;
  lottieSource?: any;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  icon = "ticket-outline",
  lottieSource,
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primary + "15" }]}>
        {lottieSource ? (
          <LottieView
            source={lottieSource}
            autoPlay
            loop
            style={styles.lottie}
          />
        ) : (
          <View style={[styles.iconInner, { backgroundColor: colors.primary + "20", borderColor: colors.primary }]}>
            <Ionicons name={icon as any} size={48} color={colors.primary} />
          </View>
        )}
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: theme.colors.primary + "15", // Higher opacity
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  iconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.primary + "20", // Higher opacity
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  lottie: {
    width: 160,
    height: 160,
  },
  title: {
    fontSize: 22,
    fontFamily: theme.fontFamily.heading,
    color: "#000000", // Solid black
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: theme.fontFamily["body-medium"],
    textAlign: "center",
    lineHeight: 24,
    maxWidth: "90%",
    color: "#111827", // Dark gray/black
  },
});

export default EmptyState;
