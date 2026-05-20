import { Dimensions, Platform } from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

// On Web/Tablet, cap the scaling dimensions to a standard mobile profile (420px max width)
// to prevent static stylesheets (StyleSheet.create) from evaluating to massive desktop sizes
// and causing content clipping/layout overflows on resize.
const isLargeScreen = Platform.OS === "web" && windowWidth > 768;
const deviceWidth = isLargeScreen ? 420 : windowWidth;
const deviceHeight = isLargeScreen ? 850 : windowHeight;

export const wp = (percentage: number) => (percentage * deviceWidth) / 100;
export const hp = (percentage: number) => (percentage * deviceHeight) / 100;

