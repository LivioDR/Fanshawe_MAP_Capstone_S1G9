import React from "react";
import { View, Switch, Text } from "react-native";
import styles from "./PTOAddRemoveSwitchStyles";

const PTOAddRemoveSwitch = ({initialValue, toggle}) => {
    return(
        <View style={styles.container}>
            <Text style={styles.label}>
                Add
            </Text>
            <Switch
            value={initialValue}
            onValueChange={toggle}
            style={styles.switch}
            />
            <Text style={styles.label}>
                Remove
            </Text>
        </View>
    )
}
export default PTOAddRemoveSwitch