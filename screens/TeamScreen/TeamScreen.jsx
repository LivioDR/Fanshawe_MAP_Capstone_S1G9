import React, { useState, useEffect } from "react";
import { View, Text, FlatList, SafeAreaView, ScrollView } from "react-native";
import UserCard from "../../components/teamScreen/userCard/UserCard";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import { useCredentials } from "../../utilities/userCredentialUtils";
import { getTeamMembersIdsByTeamId, getUserBioInfoById } from "../../services/database/userBioInfo";
import { getImageForUserId } from "../../services/database/profileImage";
import styles from "./TeamScreenStyles";

const TeamScreen = ({uid = 'super1234'}) => {

    const [teamMembers, setTeamMembers] = useState(undefined)
    const [teamSupervisors, setTeamSupervisors] = useState(undefined)
    const [loading, setLoading] = useState(true)
    
    const userCreds = useCredentials()
    const authUserId = userCreds.user.uid

    useEffect(()=>{
        (async()=>{
            const myInfo = await getUserBioInfoById(uid)
            const myTeam = await getTeamMembersIdsByTeamId(myInfo.teamId)
            const myTeamDetails = []
            const myTeamSupervisorDetails = []
            for(let i=0; i<myTeam.length; i++){
                const detail = await getUserBioInfoById(myTeam[i])
                const imgPath = await getImageForUserId(myTeam[i])
                const userDetail = {...detail, uri: imgPath, uid: myTeam[i]}
                if (detail.isSupervisor) {
                    myTeamSupervisorDetails.push(userDetail)
                } else {
                    myTeamDetails.push(userDetail)
                }
            }
            setTeamMembers(myTeamDetails)
            setTeamSupervisors(myTeamSupervisorDetails)
            setLoading(false)
        })()
    },[])

    /**
     * Generate a header and FlatList for the given users list.
     * @param {string} title list title
     * @param {object[]} users array of user objects
     * @returns a View containing the generated header and list
     */
    const createUserCards = (title, users) => {
        // don't create anything if no users provided, no point in an empty header
        if (!users || users.length === 0) {
            return
        }

        return (
            <View style={styles.list}>
                <Text style={styles.title}>
                    {title}
                </Text>
                <FlatList
                    data={users}
                    renderItem={user => (
                        <UserCard
                            id={user.item.uid}
                            name={`${user.item.firstName} ${user.item.lastName}${authUserId === user.item.uid ? " (me)" : ""}`}
                            role={user.item.role}
                            email={user.item.email}
                            imgUrl={user.item.uri}
                        />
                    )}
                    keyExtractor={user => user.uid}
                    scrollEnabled={false}   // disable scroll so we can scroll the whole view instead
                />
            </View>
        )
    }

    if(loading){
        return (
            <View style={styles.loading}>
                <LoadingIndicator />
            </View>
        )
    }

    return(
        <SafeAreaView>
            <ScrollView
                style={styles.scroll.outer}
                contentContainerStyle={styles.scroll.inner}
            >
                {createUserCards("Supervisors", teamSupervisors)}
                {createUserCards("Team Members", teamMembers)}
            </ScrollView>
        </SafeAreaView>
    )
}
export default TeamScreen