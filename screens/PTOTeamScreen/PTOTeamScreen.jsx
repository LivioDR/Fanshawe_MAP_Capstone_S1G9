import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, FlatList, SafeAreaView, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";

// UI Imports
import styles from "./PTOTeamScreenStyles";
import UserCard from "../../components/teamScreen/userCard/UserCard";
import LoadingIndicator from "../../components/common/LoadingIndicator";

// Business logic imports
import { auth } from "../../config/firebase";
import { usePTOAdmin } from "../../services/state/ptoAdmin";
import PTOEditScreen from "../PTOEditScreen/PTOEditScreen";
import { getTeamInfoById, getUserBioInfoById } from "../../services/database/userBioInfo";
import { getImageForUserId } from "../../services/database/profileImage";
import { useFocusEffect } from "@react-navigation/native";

// Theme imports
import { useTheme } from "../../services/state/useTheme";
import { darkMode, darkBg, darkFont } from "../../services/themes/themes";

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
    const [loading, setLoading] = useState(true)

    const route = useRoute()
    if (route && route.params?.id) {
        uid = route.params.id
    }
    
    const authUserId = auth.currentUser.uid
    if (!uid) {
        uid = authUserId

    }

    const { t } = useTranslation()

    const theme = useTheme()
    const isDarkMode = theme === darkMode

    useEffect(()=>{
        
        (async()=>{
            const myInfo = await getUserBioInfoById(uid)
            const myTeamInfo = await getTeamInfoById(myInfo.teamId)
            const myTeam = myTeamInfo.employees
            const myTeamDetails = []
            for(let i=0; i<myTeam.length; i++){
                const detail = await getUserBioInfoById(myTeam[i])
                const imgPath = await getImageForUserId(myTeam[i])
                const userDetail = {...detail, uri: imgPath, uid: myTeam[i]}
                if (!detail.isSupervisor) {
                    myTeamDetails.push(userDetail)
                }
            }
            setTeamMembers(myTeamDetails)
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
            <View style={[styles.list, isDarkMode ? darkBg : {}]}>
                <Text style={[styles.title, isDarkMode ? darkFont : {}]}>
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
                {createUserCards(t("team.members"), teamMembers)}
            </ScrollView>
        </SafeAreaView>
    )
}
export default PTOTeamScreen