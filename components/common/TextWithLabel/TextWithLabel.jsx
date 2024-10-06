import React from "react";
import { View, Text } from "react-native";
import styles from "./TextWithLabelStyles";

const TextWithLabel = ({label, textValue}) => {

    return(
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
            </Text>
            <Text style={styles.textValue}>
                {textValue}
            </Text>
        </View>
    )
}
export default TextWithLabel