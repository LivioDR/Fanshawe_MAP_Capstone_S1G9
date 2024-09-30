import React, { useState, useEffect } from "react";
import { Pressable, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import bioStyles from "./UserBioStyles";
// Components import
import ProfileImage from "../../components/userBio/ProfileImage/ProfileImage";
import NameRoleContainer from "../../components/userBio/NameRoleContainer/NameRoleContainer";
import TextWithLabel from "../../components/common/TextWithLabel/TextWithLabel";
import UiButton from "../../components/common/UiButton/UiButton";
// Functions import
import { getImageForUserId } from "../../services/database/profileImage";
import { getTeamInfoById, getUserBioInfoById } from "../../services/database/userBioInfo";


const UserBio = ({userId = 'user1234'}) => {

    const [imgUrl, setImgUrl] = useState(undefined)
    const [userData, setUserData] = useState({})
    const [superData, setSuperData] = useState({})
    const [teamData, setTeamData] = useState({})

    useEffect(()=>{
        const getData = async(id) => {
            // get user data
            let data = await getUserBioInfoById(id)
            setUserData(data)

            // supervisor data
            const superId = data.supervisorId
            if(superId){ // the id can be null in the database if the user has no manager/supervisor
                let supervisorData = await getUserBioInfoById(superId)
                // get supervisor data
                setSuperData(supervisorData)
            }
            else{
                setSuperData({
                    firstName: 'N/A',
                    lastName: '',
                    email: 'N/A',
                })
            }

            // team data
            const teamId = data.teamId
            let teamInfo = await getTeamInfoById(teamId)
            setTeamData(teamInfo)

            // set profle picture
            getImageForUserId(userId).then(img => setImgUrl(img))
        }
        getData(userId)
        
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
        </>
    )
}
export default UserBio