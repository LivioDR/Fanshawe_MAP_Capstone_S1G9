import React, { useState, useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import bioStyles from "./UserBioStyles";
// Components import
import TextWithLabel from "../../components/common/TextWithLabel/TextWithLabel";
import UiButton from "../../components/common/UiButton/UiButton";
// Functions import
import { useCredentials } from "../../utilities/userCredentialUtils";
import { getImageForUserId } from "../../services/database/profileImage";
import { getTeamInfoById, getUserBioInfoById } from "../../services/database/userBioInfo";
import BioHeader from "../../components/userBio/BioHeader/BioHeader";
import UserBioEditScreen from "../UserBioEditScreen/UserBioEditScreen";


const UserBio = ({ canEdit = true }) => {

    const [imgUrl, setImgUrl] = useState(undefined)
    const [userData, setUserData] = useState({})
    const [superData, setSuperData] = useState({})
    const [teamData, setTeamData] = useState({})
    const [showEditModal, setShowEditModal] = useState(false)

    const showModal = () => {setShowEditModal(true)}
    const hideModal = () => {setShowEditModal(false)}

    const userCreds = useCredentials();
    const userId = userCreds.user.uid;

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
        <SafeAreaView style={bioStyles.wrapper}>
            <UserBioEditScreen 
                uid={userId} 
                imgUrl={imgUrl} 
                setImgUrl={setImgUrl}
                userData={userData} 
                setUserData={setUserData}
                dismiss={hideModal} 
                isShown={showEditModal} 
            />
            <BioHeader 
                name={`${userData.firstName} ${userData.lastName}`} 
                role={userData.role} 
                imgUrl={imgUrl}
                onPressFunc={()=>{showModal()}}  
                canEdit={canEdit}  
            />
            <View style={bioStyles.body}>
                <TextWithLabel label={'Corporate email'} textValue={userData.email} />
                <TextWithLabel label={'Address'} textValue={userData.address} />
                <TextWithLabel label={'Birth Date'} textValue={userData.birthday} />

                <TextWithLabel label={'Team'} textValue={teamData.name} />

                <TextWithLabel label={'Supervisor'} textValue={`${superData.firstName} ${superData.lastName}`} />
                <TextWithLabel label={'Supervisor email'} textValue={superData.email} />
            </View>
            <View style={bioStyles.buttonsWrapper}>
                <UiButton label={"PTO"} type="default"/>
                <UiButton label={"Emergency contacts"} type="warning"/>
            </View>
        </SafeAreaView>
    )
}
export default UserBio