import { Platform } from "react-native"

export const safeAreaPadding = Platform.OS === "ios" ? 60 : 50;

export const dropShadowStyle = {
    // remove shadowColor on Android because it conflicts with elevation
    shadowColor: Platform.OS === "ios" ? "#666" : undefined,
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
};

// colors
export const highlight = "#EFEFEF";
export const positive = "#45CA44";
export const negative = "#C90000";
export const accent = "#316CB1";