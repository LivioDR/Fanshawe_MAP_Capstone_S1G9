import { StyleSheet } from "react-native";
import { dropShadowStyle } from "../../../utilities/variables";

export default UiButtonStyles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        width: '40%',
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
        marginVertical: 12,
    },
    textElem: {
        textAlign: 'center',
        fontSize: 18,
        flexWrap: 'wrap',
        fontWeight: 'bold',
    },
    notPressed: dropShadowStyle,
    pressed: {
        transform: [{ translateY: 3 }],
    },
})