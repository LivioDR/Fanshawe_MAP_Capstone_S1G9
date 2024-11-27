import React from "react";
import { useTranslation } from "react-i18next";
import { View, Switch, Text } from "react-native";
import styles from "./PTOAddRemoveSwitchStyles";

// Theme imports
import { useTheme } from "../../../services/state/useTheme";
import { darkMode, darkFont } from "../../../services/themes/themes";

const PTOAddRemoveSwitch = ({initialValue, toggle}) => {
    const { t } = useTranslation()

    const theme = useTheme()
    const isDarkMode = theme === darkMode

    return(
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={[styles.label, isDarkMode ? darkFont : {}]}>
                    {t("common.add")}
                </Text>
            </View>
            <Switch
            value={initialValue}
            onValueChange={toggle}
            style={styles.switch}
            />
            <View style={styles.labelContainer}>
                <Text style={[styles.label, isDarkMode ? darkFont : {}]}>
                    {t("common.remove")}
                </Text>
            </View>
        </View>
    )
}
export default PTOAddRemoveSwitch