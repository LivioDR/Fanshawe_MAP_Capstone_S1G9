import { StyleSheet } from "react-native";

export default UserCardStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5%',
    },
    textWrapper: {
        width: '70%',
    },
    textWithSwitchWrapper: {
        width: '60%',
    },
    name: {
        fontSize: 18,
    },
    role: {
        fontSize: 14,
    },
    email: {
        fontSize: 14,
    },
})