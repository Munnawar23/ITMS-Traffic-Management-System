import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileMenuItemProps {
  icon: any;
  title: string;
  onPress?: () => void;
  showBorder?: boolean;
  rightElement?: React.ReactNode;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  icon,
  title,
  onPress,
  showBorder = true,
  rightElement,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
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
};

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

export default ProfileMenuItem;
