import React from "react";
import { StyleSheet } from "react-native";
import { Pressable, Text } from "react-native";
import { accent, negative, positive } from "../../../utilities/variables";
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
    primary: {
        wrapper: {
            backgroundColor: accent,
        },
        textElem: {
            color: 'white',
        },
    }
})


const UiButton = ({label, funcToCall, customStyles = {}, type = 'default'}) => {
    return (
        <Pressable
            onPress={funcToCall}
            style={({ pressed }) => (
                [
                    styles.wrapper,
                    type !== "default" ? typeStyles[type].wrapper : undefined,
                    pressed ? styles.pressed : styles.notPressed,
                    customStyles.wrapper
                ]
            )}
        >
            <Text style={[
                styles.textElem,
                type !== "default" ? typeStyles[type].textElem : undefined,
                customStyles.textElem
            ]}>
                {label}
            </Text>
        </Pressable>
    )
}
export default UiButton