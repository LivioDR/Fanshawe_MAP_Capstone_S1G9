import { StyleSheet } from "react-native";

import { accent, negative, positive } from "../../../utilities/variables";

export default StyleSheet.create({
    banner: {
        width: "100%",
        paddingVertical: 4,
        paddingHorizontal: 10,

        clockedOut: {
            backgroundColor: negative,
        },

        clockedIn: {
            backgroundColor: positive,
        },

        onLunch: {
            backgroundColor: accent,
        },
    },

    text: {
        fontWeight: "600",
        textAlign: "center",
        color: "#FFF",
    },
});