import React, { useState, useEffect } from "react";
import { Pressable, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import bioStyles from "./UserBioStyles";
// Placeholder data
import { userBioData, supervisorBioData, teamBioData } from "../../utilities/userBioPlaceholderData";
// End of placeholder data
import ProfileImage from "../../components/userBio/ProfileImage/ProfileImage";
import NameRoleContainer from "../../components/userBio/NameRoleContainer/NameRoleContainer";
import TextWithLabel from "../../components/common/TextWithLabel/TextWithLabel";
import AvailablePTO from "../../components/userBio/AvailablePTO/AvailablePTO";
import { getImageForUserId } from "../../services/database/profileImage";
import UiButton from "../../components/common/UiButton/UiButton";


const UserBio = () => {

    const [imgUrl, setImgUrl] = useState(undefined)
    const [userData, setUserData] = useState({})
    const [superData, setSuperData] = useState({})
    const [teamData, setTeamData] = useState({})

    useEffect(()=>{
        // get user data
        const userRetrievedData = userBioData
        setUserData(userRetrievedData)
        
        if(userRetrievedData.supervisorId != null){
            // get supervisor data
            setSuperData(supervisorBioData)
        }
        else{
            setSuperData({
                firstName: 'N/A',
                lastName: '',
                email: 'N/A',
            })
        }
        // get team data
        setTeamData(teamBioData)

        // getImageForUserId(userRetrievedData.uid).then(img => setImgUrl(img))
    },[])


    return(
        <>
        <View style={bioStyles.header}>
            <ProfileImage url={imgUrl} />
            <NameRoleContainer name={`${userData.firstName} ${userData.lastName}`} role={userData.role} />
            <Pressable
                onPress={()=>{console.log('Pressed')}}
            >
                <Ionicons name="create-outline" size={24} style={bioStyles.editIcon}/>
            </Pressable>
        </View>
        <View style={bioStyles.body}>
            <TextWithLabel label={'Corporate email'} textValue={userData.email} />
            <TextWithLabel label={'Address'} textValue={userData.address} />
            <TextWithLabel label={'Birth Date'} textValue={userData.birthday} />

            <TextWithLabel label={'Team'} textValue={teamData.name} />

            <TextWithLabel label={'Supervisor'} textValue={`${superData.firstName} ${superData.lastName}`} />
            <TextWithLabel label={'Supervisor email'} textValue={superData.email} />
        </View>
        <View style={bioStyles.buttonsWrapper}>
            <UiButton label={"PTO"}/>
            <UiButton label={"Emergency contacts"}/>
        </View>
        {/* <AvailablePTO numPto={12} numSick={4}/> */}
        </>
    )
}
export default UserBio