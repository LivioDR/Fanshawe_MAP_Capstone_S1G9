import React, { useState, useEffect } from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";
import BioHeader from "../../components/userBio/BioHeader/BioHeader";
import styles from "./AdminViewStyles";
import { getTeamMembersIdsByTeamId, getUserBioInfoById } from "../../services/database/userBioInfo";
import { getImageForUserId } from "../../services/database/profileImage";
import UserCard from "../../components/adminView/userCard/UserCard";
import LoadingScreen from "../../components/common/LoadingScreen/LoadingScreen";

const AdminView = ({uid = 'super1234'}) => {

    const [adminInfo, setAdminInfo] = useState(undefined)
    const [imgUrl, setImgUrl] = useState(undefined)
    const [teamMembers, setTeamMembers] = useState(undefined)
    const [loading, setLoading] = useState(true)
    

    useEffect(()=>{
        (async()=>{
            const myInfo = await getUserBioInfoById(uid)
            setAdminInfo(myInfo)

            const myImg = await getImageForUserId(uid)
            setImgUrl(myImg)

            const myTeam = await getTeamMembersIdsByTeamId(myInfo.teamId)
            let myTeamDetails = []
            for(let i=0; i<myTeam.length; i++){
                const detail = await getUserBioInfoById(myTeam[i])
                const imgPath = await getImageForUserId(myTeam[i])
                myTeamDetails.push({...detail, uri: imgPath, uid: myTeam[i]})
            }
            setTeamMembers(myTeamDetails)
            setLoading(false)
        })()
    },[])


    if(loading){
        return(
            <LoadingScreen/>
        )
    }

    return(
        <SafeAreaView>
            <View style={styles.header}>
                <BioHeader 
                    name={`${adminInfo.firstName} ${adminInfo.lastName}`}
                    role={adminInfo.role}
                    imgUrl={imgUrl}
                    canEdit={false}
                    />
                <Text style={styles.title}>
                    Team members
                </Text>
                <FlatList
                    data={teamMembers}
                    renderItem={member => <UserCard 
                        name={`${member.item.firstName} ${member.item.lastName}`}
                        role={member.item.role}
                        email={member.item.email}
                        imgUrl={member.item.uri}
                        />}
                        keyExtractor={member => member.uri}
                        />
            </View>
        </SafeAreaView>
    )
}
export default AdminView