import React from "react";
import { View, Text } from "react-native";
import styles from "./TextWithLabelStyles";
import { darkMode, darkFont } from "../../../services/themes/themes";
import { useTheme } from "../../../services/state/useTheme";

const TextWithLabel = ({label, textValue}) => {

    const theme = useTheme()
    const isDarkMode = theme == darkMode

    return(
        <View style={styles.container}>
            <Text style={[styles.label, isDarkMode ? darkFont : {}]}>
                {label}
            </Text>
            <Text style={styles.textValue}>
                {textValue}
            </Text>
        </View>
    )
}
export default TextWithLabel