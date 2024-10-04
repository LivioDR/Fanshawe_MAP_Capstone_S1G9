import { StyleSheet } from "react-native";
import { highlight } from "../../../utilities/variables";

export default StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 15,

        backgroundColor: highlight,
        borderRadius: 10,
    },

    timeText: {
        fontSize: 16,
    },
});