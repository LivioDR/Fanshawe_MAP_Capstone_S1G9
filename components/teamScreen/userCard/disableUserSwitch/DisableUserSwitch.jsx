import { View, Text, Switch, StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {

    },
    switch: {

    },
})


const DisableUserSwitch = ({isEnabled, setEnabled}) => {


    return(
        <View style={styles.container}>
            <Text style={styles.text}>
                {isEnabled ? "Enabled" : "Disabled"}
            </Text>
            <Switch
                value={isEnabled}
                onChange={setEnabled}
                ios_backgroundColor="#f00000"
            />
        </View>
    )
}

export default DisableUserSwitch