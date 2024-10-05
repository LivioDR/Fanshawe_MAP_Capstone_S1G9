import { StyleSheet } from "react-native";

import { dropShadowStyle, negative } from "../../../utilities/variables";

export default StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

        backgroundColor: "#0004",
    },

    container: {
        position: "relative",
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

    close: {
        position: "absolute",
        top: 8,
        right: 8,
        justifyContent: "center",
        alignItems: "center",
        width: 22,
        height: 22,
        padding: 4,

        backgroundColor: negative,
        borderRadius: 5,

        label: {
            fontWeight: "bold",
            color: "#FFF",
        },
    },
});