import React from "react";
import { StyleSheet } from "react-native";
import { Pressable, Text } from "react-native";
import { accent, cta, negative, positive } from "../../../utilities/variables";
import styles from "./UiButtonStyles";

const typeStyles = StyleSheet.create({
    warning: {
        wrapper: {
            backgroundColor: negative,
        },
        textElem: {
            color: 'white',
        },
    },
    confirm: {
        wrapper: {
            backgroundColor: positive,
        },
        textElem: {
            color: 'white',
        },
    },
    CTA: {
        wrapper: {
            backgroundColor: cta,
        },
        textElem: {
            color: 'black',
        },
    },
    primary: {
        wrapper: {
            backgroundColor: accent,
        },
        textElem: {
            color: 'white',
        },
    }
})


const UiButton = ({label, funcToCall, disabled = false, customStyles = {}, type = 'default'}) => {
    return (
        <Pressable
            onPress={funcToCall}
            style={({ pressed }) => (
                [
                    styles.wrapper,
                    type !== "default" ? typeStyles[type].wrapper : undefined,
                    disabled ? styles.disabled : undefined,
                    pressed ? styles.pressed : styles.notPressed,
                    customStyles.wrapper
                ]
            )}
            disabled={disabled}
        >
            <Text style={[
                styles.textElem,
                type !== "default" ? typeStyles[type].textElem : undefined,
                disabled ? styles.textElemDisabled : undefined,
                customStyles.textElem
            ]}>
                {label}
            </Text>
        </Pressable>
    )
}
export default UiButton