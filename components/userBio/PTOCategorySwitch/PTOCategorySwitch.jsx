import React from "react";
import { useTranslation } from "react-i18next";
import { View, Switch, Text } from "react-native";
import styles from "./PTOCategorySwitchStyles";

// Theme imports
import { useTheme } from "../../../services/state/useTheme";
import { darkMode, darkFont } from "../../../services/themes/themes";

const PTOCategorySwitch = ({initialValue, toggle}) => {
    
    const { t } = useTranslation()
    const theme = useTheme()
    const isDarkMode = theme === darkMode

    return(
        <View style={styles.container}>
            <Text style={[styles.label, isDarkMode ? darkFont : {}]}>
                {t("profile.pto.pto")}
            </Text>
            <Switch
            value={initialValue}
            onValueChange={toggle}
            style={styles.switch}
            />
            <Text style={[styles.label, isDarkMode ? darkFont : {}]}>
                {t("profile.pto.sick")}
            </Text>
        </View>
    )
}
export default PTOCategorySwitch