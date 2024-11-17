import { useTranslation } from "react-i18next";
import { View, Text, Switch, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
})

const DisableUserSwitch = ({isEnabled, setEnabled}) => {
    const { t } = useTranslation()

    return(
        <View style={styles.container}>
            <Text>
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