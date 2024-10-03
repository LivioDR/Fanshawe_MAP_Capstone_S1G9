import { StyleSheet } from "react-native";

import { safeAreaPadding, dropShadowStyle, highlight } from "../../utilities/variables";

export default StyleSheet.create({
    container: {
        outer: {
            flex: 1,
            alignItems: "center",

            paddingTop: safeAreaPadding,

            backgroundColor: "#FFF",
        },

        inner: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
            gap: 85,
        },

        intro: {
            gap: 15,
            alignItems: "center",
        },

        image: {
            width: 125,
            alignItems: "center",

            ...dropShadowStyle,

            // need border radius to round shadow on Android
            borderRadius: 60,
        },

        birthday: {
            backgroundColor: highlight,
            padding: 10,
            borderRadius: 30,
        },
    },

    profileImage: {
        height: 125,
        width: 125,
    },

    welcomeText: {
        fontWeight: "500",
        fontSize: 24,
        textAlign: "center",
    },
});