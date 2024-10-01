import React from "react";
import { View, Text, TextInput } from "react-native";
import styles from "./InputFieldStyles";

const InputField = ({label, value, setValue, autoComplete = ""}) => {
    return(
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
                {label}
            </Text>
            <TextInput
                style={styles.inputField}
                autoCapitalize="words"
                autoComplete={autoComplete}
                autoCorrect={false}
                value={value}
                onChange={newValue => {setValue(newValue.nativeEvent.text)}}
            />
        </View>
    )
}
export default InputField