import { StyleSheet } from "react-native";

export default PTORequestScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameLabel: {
        fontSize: 24,
    },
    subtitle: {
        fontSize: 18,
        padding: 12,
    },
    btnContainer: {
        flexDirection: 'row',
        width: '100%',
        padding: '5%',
        gap: 20,
        justifyContent: 'space-between'
    },
    button: {
        flex: 1,
    },
})