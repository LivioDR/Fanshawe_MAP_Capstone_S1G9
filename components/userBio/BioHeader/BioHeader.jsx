import React from "react";
import { View, Pressable } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileImage from "../ProfileImage/ProfileImage";
import NameRoleContainer from "../NameRoleContainer/NameRoleContainer";
import styles from "./BioHeaderStyles";

const BioHeader = ({name, imgUrl, role, onPressFunc = ()=>{}}) => {
    return(
        <View style={styles.header}>
            <ProfileImage url={imgUrl} />
            <NameRoleContainer name={name} role={role} />
            <Pressable
                onPress={onPressFunc}
            >
                <Ionicons name="create-outline" size={24} style={styles.editIcon}/>
            </Pressable>
        </View>
    )
}
export default BioHeader