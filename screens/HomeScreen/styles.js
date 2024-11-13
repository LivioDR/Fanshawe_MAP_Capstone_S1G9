import { StyleSheet } from "react-native";

import { accent } from "../../utilities/variables";

export default StyleSheet.create({
    barButton: {
        padding: 5,
        borderRadius: 5,
    },

    btnLeft: {
        marginLeft: 5,
    },

    btnRight: {
        marginRight: 5,
    },

    btnText: {
        color: accent,
        fontSize: 16,
    },
});