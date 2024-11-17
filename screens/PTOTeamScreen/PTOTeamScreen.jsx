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
The PTOTeamScreen

This component just renders the user cards for editing the PTO

The PTO edit screen is nested here due to being a modal which is 
triggered when a UserCard is pressed, passing the pressed user's id
as a prop to the modal

This component is based off the TeamScreen component
Global state specific for this functionality is used here (usePTOAdmin)
*/

const PTOTeamScreen = ({ uid }) => {

    const { showEditPtoModal, currentIdForPtoEdit, updatePTOAdmin } = usePTOAdmin()

    /*
    Set inAdmin mode whenever screen is navigated to (focused) to give the cards
    PTO specific UI and the correct onPress functionality which opens the modal.

    When unfocused, this is changed back to false so that the cards maintain
    the correct UI and onPress functionality in different parts of the app

    Note: If useCallback is not used here, it causes infinite re-renders
    */
    useFocusEffect(
        React.useCallback(() => {

            updatePTOAdmin({ inAdminMode: true, showEditPtoModal: false })

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
                {createUserCards("Team Members", teamMembers)}
            </ScrollView>
        </SafeAreaView>
    )
}
export default PTOTeamScreen