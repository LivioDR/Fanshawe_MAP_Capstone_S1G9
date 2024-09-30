import { Platform } from "react-native"

export const safeAreaPadding = Platform.OS === "ios" ? 60 : 40;