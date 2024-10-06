/*
Styles for the Call to Action (CTA) button
*/

import { StyleSheet } from "react-native";

export default StyleSheet.create({
    disabledBtn:{

        backgroundColor: '#D3D3D3',

    },
    enabledBtn:{

        backgroundColor: '#00FFFF',

    },
    container:{
        height: 50,
        width: 280,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        color: '#000000',
        fontWeight: '600',
        fontSize: 18,
    },
});

    