import { StyleSheet } from "react-native";

export default UserBioEditScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameLabel: {
        fontSize: 24,
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        padding: '10%',
        justifyContent: 'space-between'
    },
    inputContainer: {
        width: '100%',
        padding: '5%',
    },
    inputLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputField: {
        backgroundColor: '#F0F0F0',
        padding: 3,
        fontSize: 14,
    },
})