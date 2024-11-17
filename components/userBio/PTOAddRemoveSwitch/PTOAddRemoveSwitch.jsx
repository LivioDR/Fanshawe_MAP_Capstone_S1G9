import React from "react";
import { View, Switch, Text } from "react-native";
import styles from "./PTOAddRemoveSwitchStyles";

const PTOAddRemoveSwitch = ({initialValue, toggle}) => {
    return(
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>
                    Add
                </Text>
            </View>
            <Switch
            value={initialValue}
            onValueChange={toggle}
            style={styles.switch}
            />
            <View style={styles.labelContainer}>
                <Text style={styles.label}>
                    Remove
                </Text>
            </View>
        </View>
    )
}
export default PTOAddRemoveSwitch