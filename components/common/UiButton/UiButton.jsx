import React from "react";
import { Pressable, Text } from "react-native";
import styles from "./UiButtonStyles";

const UiButton = ({label, funcToCall, customStyles = {}}) => {
    return(
        <Pressable
            onPress={funcToCall}
            style={{...styles.wrapper, ...customStyles.wrapper}}
        >
            <Text style={[styles.textElem, customStyles.textElem]}>
                {label}
            </Text>
        </Pressable>
    )
}
export default UiButton