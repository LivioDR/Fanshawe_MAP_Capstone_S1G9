import { StyleSheet } from "react-native";

export default ManageTeamScreenStyles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 24,
    },

    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    scroll: {
        outer: {
            minHeight: "100%",
        },

        inner: {
            paddingVertical: 20,
            gap: 15,
        },
    },

    list: {
        gap: 10,
    },
})