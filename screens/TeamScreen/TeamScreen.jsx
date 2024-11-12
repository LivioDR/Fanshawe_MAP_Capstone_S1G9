import React, { useState, useEffect } from "react";
import { View, Text, FlatList, SafeAreaView, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import UserCard from "../../components/teamScreen/userCard/UserCard";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import { useCredentials } from "../../services/state/userCredentials";
import styles from "./TeamScreenStyles";
import { useBioInfo, getOrLoadUserBioInfo, getTeamMemberIds, getOrLoadProfileImage } from "../../services/state/userBioInfo";

const TeamScreen = ({ uid }) => {

    const [teamMembers, setTeamMembers] = useState(undefined)
    const [teamSupervisors, setTeamSupervisors] = useState(undefined)
    const [loading, setLoading] = useState(true)

    const route = useRoute()
    if (route && route.params?.id) {
        uid = route.params.id
    }
    
    const userCreds = useCredentials()
    const authUserId = userCreds.user.uid
    if (!uid) {
        uid = authUserId

    }
    const bioInfoContext = useBioInfo()

    useEffect(()=>{
        (async()=>{
            const myInfo = await getOrLoadUserBioInfo(uid, bioInfoContext)
            const myTeam = await getTeamMemberIds(myInfo.teamId, bioInfoContext)
            const myTeamDetails = []
            const myTeamSupervisorDetails = []
            for(let i=0; i<myTeam.length; i++){
                const detail = await getOrLoadUserBioInfo(myTeam[i], bioInfoContext)
                const imgPath = await getOrLoadProfileImage(myTeam[i], bioInfoContext)
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