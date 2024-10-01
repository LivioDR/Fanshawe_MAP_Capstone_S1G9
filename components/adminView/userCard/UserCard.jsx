import React from "react";
import { View, Text } from "react-native";
import styles from "./UserCardStyles";
import ProfileImage from "../../userBio/ProfileImage/ProfileImage";
import NameRoleContainer from "../../userBio/NameRoleContainer/NameRoleContainer";

const UserCard = ({name, role, email, imgUrl}) => {
    return(
        <View style={styles.container}>
            <ProfileImage url={imgUrl} imgSize={48} placeholderSize={24} />
            <View style={styles.textWrapper}>
                <Text style={styles.name}>
                    {name}
                </Text>
                <Text style={styles.role}>
                    {role}
                </Text>
                <Text style={styles.email}>
                    {email}
                </Text>
            </View>
        </View>
    )
}
export default UserCard