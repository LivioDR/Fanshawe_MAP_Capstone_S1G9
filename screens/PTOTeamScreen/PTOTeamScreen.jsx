import React, { useState, useEffect } from "react";
import { View, Text, FlatList, SafeAreaView, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";

// UI Imports
import styles from "./PTOTeamScreenStyles";
import UserCard from "../../components/teamScreen/userCard/UserCard";
import LoadingIndicator from "../../components/common/LoadingIndicator";

// Business logic imports
import { useCredentials } from "../../services/state/userCredentials";
import { usePTOAdmin } from "../../services/state/ptoAdmin";
import PTOEditScreen from "../PTOEditScreen/PTOEditScreen";
import { getTeamInfoById, getUserBioInfoById } from "../../services/database/userBioInfo";
import { getImageForUserId } from "../../services/database/profileImage";
import { useFocusEffect } from "@react-navigation/native";

/*
This component just renders the user cards for editing the PTO
The PTO edit screen is nested here due to being a modal which is 
triggered when a UserCard is pressed
*/

const PTOTeamScreen = ({ uid }) => {

    //getting globals from state
    const { inAdminMode, showEditPtoModal, currentIdForPtoEdit, updatePTOAdmin } = usePTOAdmin()

    //Set inAdmin mode whenever screen is navigated to to give the cards
    //the correct onpress functionality
    //Without useCallback infinite renders
    useFocusEffect(
        React.useCallback(() => {

            updatePTOAdmin({ inAdminMode: true })

       
            //Sets it back to false when screen unfocused
            return () => {
                updatePTOAdmin({ inAdminMode: false })
            };
        }, [])
    );


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

    useEffect(()=>{
        
        (async()=>{
            const myInfo = await getUserBioInfoById(uid)
            const myTeamInfo = await getTeamInfoById(myInfo.teamId)
            const myTeam = myTeamInfo.employees
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
    },[showEditPtoModal]) //Updates with new value when modal closes (slight delay)

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
                            remainingPTODays={user.item.remainingPTODays}
                            remainingSickDays={user.item.remainingSickDays}
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

            {showEditPtoModal && (
            <PTOEditScreen
                userId={currentIdForPtoEdit}
            />
            )}

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
export default PTOTeamScreen