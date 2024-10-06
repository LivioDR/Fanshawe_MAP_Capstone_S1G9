import { StyleSheet } from "react-native";
import { dropShadowStyle, highlight } from "../../../utilities/variables";

export default UiButtonStyles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        minWidth: '40%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
        marginVertical: 12,
        paddingHorizontal: 10,
    },
    disabled: {
        backgroundColor: highlight,
    },
    textElem: {
        textAlign: 'center',
        fontSize: 18,
        flexWrap: 'wrap',
        fontWeight: 'bold',
    },
    textElemDisabled: {
        color: "#777",
    },
    notPressed: dropShadowStyle,
    pressed: {
        transform: [{ translateY: 3 }],
    },
})