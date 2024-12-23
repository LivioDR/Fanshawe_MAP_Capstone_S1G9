import { StyleSheet } from "react-native";

export default FromToDatePickerStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '40%',
        alignItems: 'flex-start'
    },
    label: {
        width: '100%',
        textAlign: 'left',
        paddingHorizontal: 12,
        fontWeight: 'bold',
    },
    androidDate: {
        fontSize: 18,
        paddingHorizontal: 12,
    },  
    picker: {
        paddingBottom: 12,
    },
})