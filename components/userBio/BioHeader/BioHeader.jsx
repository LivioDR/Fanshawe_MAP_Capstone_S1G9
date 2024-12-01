import React from "react";
import { View, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileImage from "../ProfileImage/ProfileImage";
import NameRoleContainer from "../NameRoleContainer/NameRoleContainer";
import styles from "./BioHeaderStyles";
import { darkMode, darkFont } from "../../../services/themes/themes";
import { useTheme } from "../../../services/state/useTheme";

const BioHeader = ({name, imgUrl, role, onPressFunc = ()=>{}, canEdit}) => {

    const theme = useTheme()
    const isDarkMode = theme === darkMode

    return(
        <View style={styles.header}>
            <ProfileImage url={imgUrl} />
            <NameRoleContainer name={name} role={role} />
            {
                canEdit &&
                <Pressable
                    onPress={onPressFunc}
                >
                    <Ionicons name="create-outline" size={24} style={[styles.editIcon, isDarkMode ? darkFont : {}]}/>
                </Pressable>
            }
        </View>
    )
}
export default BioHeader