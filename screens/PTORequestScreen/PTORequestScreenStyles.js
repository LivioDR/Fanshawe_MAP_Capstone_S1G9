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
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        padding: '5%',
        justifyContent: 'space-between'
    },
})