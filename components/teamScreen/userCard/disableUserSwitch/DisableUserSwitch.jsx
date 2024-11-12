import { View, Text, Switch, StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {

    },
    text: {

    },
    switch: {

    },
})


const DisableUserSwitch = ({id, isDisabled, setDisable}) => {


    return(
        <View>
            <Text>
                Disable
            </Text>
            <Switch
                value={isDisabled}
                onChange={()=>{console.log(`Toggled user ${id}`)}}
            />
        </View>
    )
}

export default DisableUserSwitch