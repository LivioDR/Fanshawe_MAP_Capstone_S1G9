import React from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileImage from "../../userBio/ProfileImage/ProfileImage";
import { highlight } from "../../../utilities/variables";
import { useCredentials } from "../../../services/state/userCredentials";
import styles from "./UserCardStyles";
import DisableUserSwitch from "./disableUserSwitch/DisableUserSwitch";

const UserCard = ({id, name, role, email, imgUrl, isDisabled = false, interactive = true}) => {
    const navigation = useNavigation()
    const userCreds = useCredentials()
    const authUserId = userCreds.user.uid

    // just in case we aren't able to navigate, don't add a click handler
    // also don't add it for the current user, since they have a profile tab
    const navToDetails = !!navigation && id !== authUserId ?
        () => {
            navigation.navigate("TeamMemberDetails", { id })
        } :
        undefined

        if(interactive){
            return(
                <TouchableHighlight
                    style={styles.container}
                    underlayColor={highlight}
                    onPress={navToDetails}
                >
                    <>
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
                    </>
                </TouchableHighlight>
            )
        }
        else{
            return(
                <View style={styles.container}>
                    <ProfileImage url={imgUrl} imgSize={48} placeholderSize={24} />
                    <View style={styles.textWithSwitchWrapper}>
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
                    <DisableUserSwitch id={id} isDisabled={isDisabled}/>
                </View>
            )
        }
}
export default UserCard