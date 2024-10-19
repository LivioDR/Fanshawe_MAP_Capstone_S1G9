import React from "react";
import { View, Switch, Text } from "react-native";
import styles from "./PTOCategorySwitchStyles";

const PTOCategorySwitch = ({initialValue, toggle}) => {
    return(
        <View style={styles.container}>
            <Text style={styles.label}>
                PTO
            </Text>
            <Switch
            value={initialValue}
            onValueChange={toggle}
            style={styles.switch}
            />
            <Text style={styles.label}>
                Sick
            </Text>
        </View>
    )
}
export default PTOCategorySwitch