import { StyleSheet } from "react-native";

export default UserBioStyles = StyleSheet.create({
    wrapper: {
        paddingVertical: 12,
        height: '100%',
    },
    body: {
        width: '100%',
    },
    buttonsWrapper: {
        flexDirection: 'row',
        paddingHorizontal: "5%",
        gap: 20,
    },
    button: {
        flex: 1,
    },
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
})