/*
Styles for App.js
*/
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {                                                                                                                                                                                                                                                                                    
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInputContainer: {
        color: '#000000',
        backgroundColor: '#EFEFEF',
        height: 50,
        width: 280,
        borderRadius: 5,
        paddingLeft: 10,
        borderColor: '#000000',
        borderWidth: '1px'
    },
    footer: {
        position: 'absolute',
        paddingBottom: 20,
        bottom: 40,
    },
});

export default styles;
    