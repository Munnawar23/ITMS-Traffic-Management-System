import { theme } from "@/styles/theme";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface TopIndicatorProps {
  height?: number;
  color?: string;
  style?: ViewStyle;
}

const TopIndicator: React.FC<TopIndicatorProps> = ({
  height = 4,
  color = theme.colors.primary,
  style,
}) => {
  return (
    <View
      style={[styles.indicator, { height, backgroundColor: color }, style]}
    />
  );
};

const styles = StyleSheet.create({
  indicator: {
    width: "100%",
  },
});

export default TopIndicator;
