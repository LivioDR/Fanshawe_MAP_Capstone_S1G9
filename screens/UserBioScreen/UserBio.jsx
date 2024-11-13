import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import bioStyles from "./UserBioStyles";
// Components import
import TextWithLabel from "../../components/common/TextWithLabel/TextWithLabel";
import UiButton from "../../components/common/UiButton/UiButton";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import BioHeader from "../../components/userBio/BioHeader/BioHeader";
import UserBioEditScreen from "../UserBioEditScreen/UserBioEditScreen";
import ClockStatusBanner from "../../components/timeClock/ClockStatusBanner";
import PTORequestScreen from "../PTORequestScreen/PTORequestScreen";
// Functions import
import { useCredentials } from "../../services/state/userCredentials";
import { useBioInfo, getOrLoadUserBioInfo, getOrLoadTeamInfo, getOrLoadProfileImage } from "../../services/state/userBioInfo";
import { getOrLoadOpenTimeLog, useTimeLog } from "../../services/state/timeClock";

// TODO: rework canEdit to base off of admin role and if we're viewing current logged in user
const UserBio = ({ userId, canEdit = true }) => {

    const [loading, setLoading] = useState(true)

    const [imgUrl, setImgUrl] = useState(undefined)
    const [userData, setUserData] = useState({})
    const [superData, setSuperData] = useState({})
    const [teamData, setTeamData] = useState({})
    const [clockStatus, setClockStatus] = useState({})
    const [showEditModal, setShowEditModal] = useState(false)
    const [showPtoModal, setShowPtoModal] = useState(false)
    const [needsRefresh, setNeedsRefresh] = useState(false)

    const showModal = () => {setShowEditModal(true)}
    const hideModal = () => {setShowEditModal(false)}

    const showPto = () => {setShowPtoModal(true)}
    const hidePto = () => {
        setShowPtoModal(false)
        // flag that we need to refresh the user data from state when PTO modal is closed
        // possible TODO: use global state directly in this screen instead of duplicating state,
        // which would allow circumventing this
        setNeedsRefresh(true)
    }
    
    const route = useRoute()
    if (route && route.params?.id) {
        userId = route.params.id
    }

    const userCreds = useCredentials()
    const authUserId = userCreds.user.uid
    if (!userId) {
        userId = authUserId
    }

    // set an effect that refreshes the current user's bio data if it's needed
    // normally, updating a dependent state var in an effect isn't a good idea because
    // it can cause infinite loops, but this case is safe because we have a conditional
    // it will run once when the screen opens and do nothing,
    // once when the PTO modal is closed because needsRefresh = true,
    // then run once more after changing needsRefresh to false and do nothing
    // not the most elegant solution, but it's quick and dirty and it works without a huge overhaul of state in the app
    useEffect(() => {
        (async () => {
            if (needsRefresh) {
                const data = await getOrLoadUserBioInfo(userId, bioInfoContext)
                setUserData(data)
                setNeedsRefresh(false)
            }
        })()
    }, [needsRefresh])

    const bioInfoContext = useBioInfo()
    const timeLogContext = useTimeLog()

    const { t } = useTranslation()

    useEffect(()=>{
        const getData = async(id) => {
            // get user data
            let data = await getOrLoadUserBioInfo(id, bioInfoContext)
            setUserData(data)

            // supervisor data
            const superId = data.supervisorId
            if(superId){ // the id can be null in the database if the user has no manager/supervisor
                const supervisorData = await getOrLoadUserBioInfo(superId, bioInfoContext)
                // get supervisor data
                setSuperData(supervisorData)
            }
            else{
                setSuperData({
                    firstName: t("common.notApplicable"),
                    lastName: '',
                    email: t("common.notApplicable"),
                })
            }

            // team data
            const teamId = data.teamId
            const teamInfo = await getOrLoadTeamInfo(teamId, bioInfoContext)
            setTeamData(teamInfo)

            // set profle picture
            const img = await getOrLoadProfileImage(id, bioInfoContext)
            setImgUrl(img)

            // time clock data, only load if this is not the logged in user
            if (id !== authUserId) {
                const timeLog = await getOrLoadOpenTimeLog(id, timeLogContext)
                if (timeLog) {
                    const newClockStatus = {
                        clockedIn: timeLog.clockInTime && !timeLog.clockOutTime,
                        onLunch: timeLog.onLunchTime && !timeLog.offLunchTime,
                        timeLog,
                    }
                    setClockStatus(newClockStatus)
                }
            }

            // show the data
            setLoading(false)
        }
        getData(userId)
        
    },[])

    if(loading){
        return(
            <View style={bioStyles.loading}>
                <LoadingIndicator/>
            </View>
        )
    }

    return(
        <>
        {userId !== authUserId &&
        <ClockStatusBanner clockStatus={clockStatus} name={userData.firstName} />}
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
            <PTORequestScreen
                userId={userId}
                supervisorId={userData.supervisorId}
                isShown={showPtoModal}
                dismiss={hidePto}
                pto={userData.remainingPTODays}
                sick={userData.remainingSickDays}
            />
            <BioHeader 
                name={`${userData.firstName} ${userData.lastName}`} 
                role={userData.role} 
                imgUrl={imgUrl}
                onPressFunc={()=>{showModal()}}  
                // TODO: rework this to base off of admin role and if we're viewing current logged in user
                canEdit={userId === authUserId}  
            />
            <View style={bioStyles.body}>
                <TextWithLabel label={t("profile.companyEmail")} textValue={userData.email} />
                <TextWithLabel label={t("profile.address")} textValue={userData.address} />
                <TextWithLabel label={t("profile.birthDate")} textValue={userData.birthday} />

                <TextWithLabel label={t("profile.team")} textValue={teamData.name} />

                <TextWithLabel label={t("profile.supervisor")} textValue={`${superData.firstName} ${superData.lastName}`} />
                <TextWithLabel label={t("profile.supervisorEmail")} textValue={superData.email} />
            </View>
            {userId === authUserId &&
                <View style={bioStyles.buttonsWrapper}>
                    <UiButton label={t("profile.pto.pto")} type="default" funcToCall={showPto} customStyles={{ wrapper: bioStyles.button }}/>
                    <UiButton label={t("profile.emergencyContacts")} type="warning" customStyles={{ wrapper: bioStyles.button }}/>
                </View>}
        </SafeAreaView>
        </>
    )
}
export default UserBio