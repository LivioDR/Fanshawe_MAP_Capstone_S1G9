import { StyleSheet } from "react-native";

export default PtoCounterStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '30%',
        borderWidth: 3,
        borderRadius: 5,
        },
    title: {
        fontSize: 18,
        backgroundColor: '#D01010',
        color: 'white',
        textAlign: 'center',
        flexWrap: 'wrap',
        padding: 2,
    },
    value: {
        textAlign: 'center',
        fontSize: 52,
        backgroundColor: '#F0F0F0',
    }
})