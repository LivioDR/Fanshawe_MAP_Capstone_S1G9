import { StyleSheet } from "react-native";

import { safeAreaPadding } from "../../utilities/variables";

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",

        paddingTop: safeAreaPadding,

        backgroundColor: "#FFFFFF",
    },
});