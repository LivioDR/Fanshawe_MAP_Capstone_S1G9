import { StyleSheet } from "react-native";

export default PtoCounterStyles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'blue',
        width: '30%',
        marginVertical: '2%',
    },
    title: {
        fontSize: 18,
        backgroundColor: 'lightgrey',
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    value: {
        textAlign: 'center',
        fontSize: 52,
        color: 'white',
    }
})