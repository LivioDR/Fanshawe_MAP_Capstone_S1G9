import React,{useState} from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileImage from "../../userBio/ProfileImage/ProfileImage";
import { highlight } from "../../../utilities/variables";
import { useCredentials } from "../../../services/state/userCredentials";
import styles from "./UserCardStyles";
import DisableUserSwitch from "./disableUserSwitch/DisableUserSwitch";
import { updateUserBioInfoById } from "../../../services/database/userBioInfo";
import { usePTOAdmin } from "../../../services/state/ptoAdmin";
import { useTranslation } from "react-i18next";

const UserCard = ({id, name, role, email, imgUrl, remainingPTODays, remainingSickDays, isEnabled = true, toggleUser = ()=>{}, interactive = true}) => {
    const navigation = useNavigation()
    const userCreds = useCredentials()
    const authUserId = userCreds.user.uid

    const [enabled, setEnabled] = useState(isEnabled)
    const { inAdminMode, updatePTOAdmin } = usePTOAdmin()

    const { t } = useTranslation()

    // just in case we aren't able to navigate, don't add a click handler
    // also don't add it for the current user, since they have a profile tab
    const navToDetails = !!navigation && id !== authUserId ?
        () => {
            navigation.navigate("TeamMemberDetails", { id })
        } :
        undefined

    /*
    This sets the flag to show the modal for editing the PTO of the
    given user.
    The id of the current card is used for the PTO edit modal to ensure
    that the correct user's PTO information is displayed and can be edited.
    */
    const navToEditPTO = !!navigation && id !== authUserId ?
        () => {
            updatePTOAdmin({ showEditPtoModal: true, currentIdForPtoEdit: id })

        } :
        undefined


    // function to handle the toggle to enable/disable the user from logging in
    const toggleUserStatus = async(id) => {
        await updateUserBioInfoById(id, {isEnabled: !enabled})
        setEnabled(prev => !prev)
    }

    if(interactive){
        return(
            <TouchableHighlight
                style={styles.container}
                underlayColor={highlight}
                onPress={inAdminMode ? navToEditPTO : navToDetails}
            >
                <>
                    <ProfileImage url={imgUrl} imgSize={48} placeholderSize={24} />
                    <View style={styles.textWrapper}>
                        <Text style={styles.name}>
                            {name}
                        </Text>
                        <Text style={styles.role}>
                            {inAdminMode ? `${t("profile.pto.ptoRemaining")}: ${remainingPTODays}` : role}
                        </Text>
                        <Text style={styles.email}>
                            {inAdminMode ? `${t("profile.pto.sickRemaining")}: ${remainingSickDays}` : email}
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
                <DisableUserSwitch id={id} isEnabled={enabled} setEnabled={()=>{toggleUserStatus(id)}}/>
            </View>
        )
    }
}
export default UserCard