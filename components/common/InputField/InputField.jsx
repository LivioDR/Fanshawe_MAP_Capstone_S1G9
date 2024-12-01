import React from "react";
import { View, Text, TextInput } from "react-native";
import styles from "./InputFieldStyles";

// Theme imports
import { useTheme } from "../../../services/state/useTheme";
import { darkMode, darkFont } from "../../../services/themes/themes";

const InputField = ({label, value, setValue, autoComplete = "", autoCapitalize = "words", onChangeText, keyboardType}) => {

    const theme = useTheme()
    const isDarkMode = theme === darkMode

    return(
        <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, isDarkMode ? darkFont : {}]}>
                {label}
            </Text>
            <TextInput
                style={styles.inputField}
                autoCapitalize={autoCapitalize}
                autoComplete={autoComplete}
                autoCorrect={false}
                value={value}
                onChange={newValue => {setValue(newValue.nativeEvent.text)}}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
            />
        </View>
    )
}
export default InputField