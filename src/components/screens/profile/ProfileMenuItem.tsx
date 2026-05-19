import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { theme } from "@/styles/theme";

interface ProfileMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress?: () => void;
  showBorder?: boolean;
  rightElement?: React.ReactNode;
}

export default function ProfileMenuItem({
  icon,
  title,
  onPress,
  showBorder = true,
  rightElement,
}: ProfileMenuItemProps) {
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress ? handlePress : undefined}
      disabled={!onPress}
      style={[styles.container, showBorder && styles.border]}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color={theme.colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {rightElement ? (
        rightElement
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#000000",
  },
});
