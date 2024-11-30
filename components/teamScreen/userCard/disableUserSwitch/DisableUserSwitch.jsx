import { useTranslation } from "react-i18next";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useTheme } from "../../../../services/state/useTheme";
import { darkMode, darkFont, darkBg } from "../../../../services/themes/themes";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
})

const DisableUserSwitch = ({isEnabled, setEnabled}) => {
    const { t } = useTranslation()
    const theme = useTheme()
    const isDarkMode = theme === darkMode

    return(
        <View style={[styles.container, isDarkMode ? darkBg : {}]}>
            <Text style={[isDarkMode ? darkFont : {}]}>
                {isEnabled ? t("common.enabled") : t("common.disabled")}
            </Text>
            <Switch
                value={isEnabled}
                onChange={setEnabled}
                ios_backgroundColor="#f00000"
            />
        </View>
    )
}

export default DisableUserSwitch