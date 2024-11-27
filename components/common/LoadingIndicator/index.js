import { useTranslation } from "react-i18next";

import { View, Text, ActivityIndicator } from "react-native";

import styles from "./styles";

import { useTheme } from "../../../services/state/useTheme";
import { darkMode, darkBg, darkFont } from "../../../services/themes/themes";

export default function LoadingIndicator({ textOverride }) {
    let t;
    if (!textOverride) {
        t = useTranslation().t;
    }

    const theme = useTheme()
    const isDarkMode = theme === darkMode

    return (
        <View style={[styles.container, isDarkMode ? darkBg : {}]}>
            <ActivityIndicator size="large" />
            <Text style={[styles.text, isDarkMode ? darkFont : {}]}>{!!textOverride ? textOverride : t("common.loading")}</Text>
        </View>
    );
}