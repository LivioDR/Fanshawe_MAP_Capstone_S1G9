import { View, Text, Switch, StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {

    },
    text: {

    },
    switch: {

    },
})


const DisableUserSwitch = ({isEnabled, setEnabled}) => {


    return(
        <View>
            <Text>
                Enabled
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