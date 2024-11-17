import { StyleSheet } from "react-native";

export default PTORequestScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', 
        width: '100%', 
        marginVertical: 4,
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
    errorTextContainer:{
        height: '3%',
    },
    errorText:{
        color: "#FF2321"
    }
})