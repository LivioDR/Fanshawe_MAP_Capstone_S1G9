import { StyleSheet } from "react-native";

import { dropShadowStyle } from "../../../utilities/variables";

export default StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#0004",
    },

    container: {
        gap: 15,
        maxWidth: "90%",
        padding: 10,

        backgroundColor: "#FFF",
        borderRadius: 10,

        ...dropShadowStyle,
    },

    title: {
        marginBottom: 10,

        fontSize: 20,
        fontWeight: "600",
    },

    picker: {
        container: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },

        label: {
            fontSize: 16,
        },
    },
});