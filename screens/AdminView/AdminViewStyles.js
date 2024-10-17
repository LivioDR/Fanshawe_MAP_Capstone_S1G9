import { StyleSheet } from "react-native";

export default AdminViewStyles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 24,
    },

    loading: {
        container: {
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },

        text: {
            fontSize: 18,
        },
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