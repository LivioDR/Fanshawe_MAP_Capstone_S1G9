import React from "react";
import { View, Text } from "react-native";
import nameRoleStyles from "./NameRoleStyles";

const NameRoleContainer = ({name = '', role = ''}) => {
    return(
        <View style={nameRoleStyles.container}>
            <Text style={nameRoleStyles.title}>
                {name}
            </Text>
            <Text style={nameRoleStyles.role}>
                {role}
            </Text>
        </View>
    )
}
export default NameRoleContainer