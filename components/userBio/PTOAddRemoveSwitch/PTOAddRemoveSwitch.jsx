import React from "react";
import { useTranslation } from "react-i18next";
import { View, Switch, Text } from "react-native";
import styles from "./PTOAddRemoveSwitchStyles";

const PTOAddRemoveSwitch = ({initialValue, toggle}) => {
    const { t } = useTranslation()

    return(
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>
                    {t("common.add")}
                </Text>
            </View>
            <Switch
            value={initialValue}
            onValueChange={toggle}
            style={styles.switch}
            />
            <View style={styles.labelContainer}>
                <Text style={styles.label}>
                    {t("common.remove")}
                </Text>
            </View>
        </View>
    )
}
export default PTOAddRemoveSwitch