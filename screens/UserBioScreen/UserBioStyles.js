import { StyleSheet } from "react-native";

export default UserBioStyles = StyleSheet.create({
    wrapper: {
        paddingVertical: 12,
    },
    body: {
        width: '100%',
    },
    buttonsWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
    },
    button: {
        height: 50,
        width: undefined,
        minWidth: "40%"
    },
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
})