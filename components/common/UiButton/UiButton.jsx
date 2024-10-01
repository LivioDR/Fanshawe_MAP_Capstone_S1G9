import React from "react";
import { StyleSheet } from "react-native";
import { Pressable, Text } from "react-native";
import styles from "./UiButtonStyles";

const typeStyles = StyleSheet.create({
    warning: {
        wrapper: {
            backgroundColor: '#DD0000',
        },
        textElem: {
            color: 'white',
        },
    },
    confirm: {
        wrapper: {
            backgroundColor: '#00DD00',
        },
        textElem: {
            color: 'white',
        },
    },
    primary: {
        wrapper: {
            backgroundColor: '#0000DD',
        },
        textElem: {
            color: 'white',
        },
    }
})


const UiButton = ({label, funcToCall, customStyles = {}, type = 'default'}) => {
    if(type == 'default'){
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
    else{
        return(
            <Pressable
                onPress={funcToCall}
                style={{...styles.wrapper, ...typeStyles[type].wrapper, ...customStyles.wrapper}}
            >
                <Text style={[styles.textElem, typeStyles[type].textElem, customStyles.textElem]}>
                    {label}
                </Text>
            </Pressable>
        )
    }
}
export default UiButton