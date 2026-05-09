import { theme } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onSearchPress?: () => void;
  onRefresh?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showBorder?: boolean;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  onSearchPress,
  onRefresh,
  leftIcon,
  rightIcon,
  showBorder = false,
}) => {
  return (
    <View style={[styles.header, showBorder && styles.border]}>
      <View style={styles.headerRow}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
        </View>
        <View style={styles.actionButtons}>
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
          {onRefresh && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onRefresh}
            >
              <Ionicons
                name="refresh-outline"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )}
          {onSearchPress && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onSearchPress}
            >
              <Ionicons
                name="search-outline"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftIconContainer: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fontFamily.heading,
    color: "#000000",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: theme.fontFamily["body-medium"],
    color: "#6B7280",
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightIconContainer: {
    marginLeft: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
});

export default ScreenHeader;
