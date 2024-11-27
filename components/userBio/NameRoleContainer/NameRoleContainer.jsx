import React from "react";
import { View, Text } from "react-native";
import nameRoleStyles from "./NameRoleStyles";
import { darkMode, darkFont } from "../../../services/themes/themes";
import { useTheme } from "../../../services/state/useTheme";

const NameRoleContainer = ({name = '', role = ''}) => {

    const theme = useTheme()
    const isDarkMode = theme === darkMode

    return(
        <View style={nameRoleStyles.container}>
            <Text style={[nameRoleStyles.title, isDarkMode ? darkFont : {}]}>
                {name}
            </Text>
            <Text style={[nameRoleStyles.role, isDarkMode ? darkFont : {}]}>
                {role}
            </Text>
        </View>
    )
}
export default NameRoleContainer