import { Platform, StyleSheet } from "react-native";

import { safeAreaPadding } from "../../utilities/variables";

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

            // make shadow darker on Android
            shadowColor: Platform.OS === "ios" ? "#666" : "#000",
            shadowOffset: {
                width: 0,
                height: 3,
            },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            elevation: 4,

            // need background color to show on Android
            backgroundColor: "#0001",
            // need border radius to round shadow on Android
            borderRadius: 60,
        },

        birthday: {
            backgroundColor: "#DDD",
            padding: 10,
            borderRadius: 30,
        },
    },

    banner: {
        width: "100%",
        paddingVertical: 4,
        paddingHorizontal: 10,

        backgroundColor: "#45CA44",

        text: {
            fontWeight: 500,
            textAlign: "center",
            color: "#FFF",
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