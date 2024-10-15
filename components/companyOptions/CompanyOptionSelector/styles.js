import { StyleSheet } from "react-native";

import { highlight, lightDropShadowStyle } from "../../../utilities/variables";

export default StyleSheet.create({
    container: {
        position: "relative",
        minWidth: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: highlight,
        ...lightDropShadowStyle,
    },

    iconContainer: {
        position: "absolute",
        left: 12,
    },

    caption: {
        fontSize: 17,
        textAlign: "center",
    },
});