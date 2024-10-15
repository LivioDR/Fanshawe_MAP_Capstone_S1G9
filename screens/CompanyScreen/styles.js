import { StyleSheet } from "react-native";

import { safeAreaPadding } from "../../utilities/variables";

export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        paddingTop: safeAreaPadding,
    },
});