import { StyleSheet } from "react-native";

export default UserBioStyles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: 25,
        paddingHorizontal: '5%',
    },
    editIcon: {
        paddingVertical: 24,
        paddingLeft: 24,
    },
    body: {
        width: '100%',
        paddingVertical: 32,
    },
    buttonsWrapper: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
})