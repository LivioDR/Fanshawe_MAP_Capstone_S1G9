import React from "react";
import { useTranslation } from "react-i18next";
import { View, Switch, Text } from "react-native";
import styles from "./PTOCategorySwitchStyles";

const PTOCategorySwitch = ({initialValue, toggle}) => {
    const { t } = useTranslation()

    return(
        <View style={styles.container}>
            <Text style={styles.label}>
                {t("profile.pto.pto")}
            </Text>
            <Switch
            value={initialValue}
            onValueChange={toggle}
            style={styles.switch}
            />
            <Text style={styles.label}>
                {t("profile.pto.sick")}
            </Text>
        </View>
    )
}
export default PTOCategorySwitch