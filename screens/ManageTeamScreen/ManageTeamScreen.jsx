import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, FlatList, SafeAreaView, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import UserCard from "../../components/teamScreen/userCard/UserCard";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import { auth } from "../../config/firebase";
import { getTeamInfoById, getUserBioInfoById } from "../../services/database/userBioInfo";
import { getImageForUserId } from "../../services/database/profileImage";
import styles from "./ManageTeamScreenStyles";

// Theme imports
import { useTheme } from "../../services/state/useTheme";
import { darkMode, darkBg, darkFont, darkBgFont } from "../../services/themes/themes";

const ManageTeamScreen = ({ uid }) => {

    const [teamMembers, setTeamMembers] = useState(undefined)
    const [loading, setLoading] = useState(true)

    const theme = useTheme()
    const isDarkMode = theme === darkMode

    const route = useRoute()
    if (route && route.params?.id) {
        uid = route.params.id
    }
    
    const authUserId = auth.currentUser.uid
    if (!uid) {
        uid = authUserId

    }

    const { t } = useTranslation()

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
            <View style={[styles.list, isDarkMode ? darkBg : {}]}>
                <Text style={[styles.title, isDarkMode ? darkFont : {}]}>
                    {title}
                </Text>
                <FlatList
                    data={users}
                    renderItem={user => (
                        <UserCard
                            interactive={false}
                            isEnabled={user.item.isEnabled}
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
            <View style={[styles.loading, isDarkMode ? darkBgFont : {}]}>
                <LoadingIndicator />
            </View>
        )
    }

    return(
        <SafeAreaView>
            <ScrollView
                style={[styles.scroll.outer, isDarkMode ? darkBg : {}]}
                contentContainerStyle={styles.scroll.inner}
            >
                {createUserCards(t("team.members"), teamMembers)}
            </ScrollView>
        </SafeAreaView>
    )
}
export default ManageTeamScreen