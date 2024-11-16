import React,{useState} from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileImage from "../../userBio/ProfileImage/ProfileImage";
import { highlight } from "../../../utilities/variables";
import { useCredentials } from "../../../services/state/userCredentials";
import styles from "./UserCardStyles";
import DisableUserSwitch from "./disableUserSwitch/DisableUserSwitch";
import { useBioInfo, updateUserBioInfo } from "../../../services/state/userBioInfo";
import { usePTOAdmin } from "../../../services/state/ptoAdmin";

const UserCard = ({id, name, role, email, imgUrl, remainingPTODays, remainingSickDays, isEnabled = true, toggleUser = ()=>{}, interactive = true}) => {
    const navigation = useNavigation()
    const userCreds = useCredentials()
    const authUserId = userCreds.user.uid
    const bioInfoContext = useBioInfo()
   
    const [enabled, setEnabled] = useState(isEnabled)
    const { inAdminMode, updatePTOAdmin } = usePTOAdmin()

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

            console.log("BioInfoContext in UserCard ", bioInfoContext)
        } :
        undefined


    // function to handle the toggle to enable/disable the user from logging in
    const toggleUserStatus = async(id) => {
        await updateUserBioInfo(id, {isEnabled: !enabled}, bioInfoContext)
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
                            {inAdminMode ? `PTO days remaining: ${remainingPTODays}` : role}
                        </Text>
                        <Text style={styles.email}>
                            {inAdminMode ? `Sick days remaining: ${remainingSickDays}` : email}
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