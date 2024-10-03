import { StyleSheet } from "react-native";

import { highlight, positive, negative, accent, dropShadowStyle } from "../../../utilities/variables";

export default StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: 24,
        justifyContent: "center",
    },

    clockBtn: {
        width: "47%",
        padding: 10,

        backgroundColor: highlight,
        borderRadius: 5,

        ...dropShadowStyle,

        text: {
            textAlign: "center",
            fontWeight: "600",
        },

        green: {
            backgroundColor: positive,
        },

        red: {
            backgroundColor: negative,
        },

        blue: {
            backgroundColor: accent,
        },
    },
});