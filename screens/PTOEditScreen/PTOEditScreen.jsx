import { useEffect, useState } from "react";
import { Alert, View, Text, Modal } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";

// UI imports
import styles from "./PTOEditScreenStyles";
import bioStyles from "../UserBioScreen/UserBioStyles";
import PTOCategorySwitch from "../../components/userBio/PTOCategorySwitch/PTOCategorySwitch";
import PTOAddRemoveSwitch from "../../components/userBio/PTOAddRemoveSwitch/PTOAddRemoveSwitch";
import UiButton from "../../components/common/UiButton/UiButton";
import InputField from "../../components/common/InputField/InputField";
import InputMsgBox from "../../components/InputMsgBox";
import FromToDatePicker from "../../components/userBio/FromToDatePicker/FromToDatePicker";
import AvailablePTO from "../../components/userBio/AvailablePTO/AvailablePTO";
import LoadingIndicator from "../../components/common/LoadingIndicator";

// Business logic imports
import { requestDays } from "../../services/database/ptoManagement";
import { useBioInfo, getOrLoadUserBioInfo, getOrLoadTeamInfo, getOrLoadProfileImage } from "../../services/state/userBioInfo";
import { getOrLoadOpenTimeLog, useTimeLog } from "../../services/state/timeClock";
import { useCredentials } from "../../services/state/userCredentials";
import { usePTOAdmin } from "../../services/state/ptoAdmin";
import { updateAvailableDays } from "../../services/database/ptoManagement";


/*
Getting the ID from the pressed card
This id uses similar logic to the UserBio component to get other data for 
the PTO screen

Need to get the userId, supervisorId, isShown, dismiss, pto, sick for this screen to work


TODO: Functionality list

- Add PTO days [X]
- Add sick days [X]
- Remove PTO days [X]
- Remove sick days [X]

Sanity checking (Feedback through errormsgbox)

- Added days cannot exceed x amount? - Nope, company specific so no cap (can always be changed by admin)

- Cannot remove more days than they have for that PTO category


UI
-Make sure after days added/removed that the teamPTOScreen refreshes to show updated data
-Fix loading implementation for UI


*/

const PTOEditScreen = ({userId}) => {

    //Getting global show from the state:
    const { inAdminMode, updatePTOAdmin, showEditPtoModal, currentIdForPtoEdit } = usePTOAdmin()

    const bioInfoContext = useBioInfo()
    const timeLogContext = useTimeLog()
    const bioState = useBioInfo()

    /*
    Using logic from UserBio.jsx to convert the userId into data suitable for the screen
    Returns: userId, userData.supervisorId, showPtoModal, hidePto, 
    */

    const [loading, setLoading] = useState(true)
    const [imgUrl, setImgUrl] = useState(undefined)
    const [userData, setUserData] = useState({})
    const [superData, setSuperData] = useState({})
    const [teamData, setTeamData] = useState({})
    const [clockStatus, setClockStatus] = useState({})
    const [canEditOthers, setCanEditOthers] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showPtoModal, setShowPtoModal] = useState(true)
    const [needsRefresh, setNeedsRefresh] = useState(true) //change to true, as need refresh whenever loading

    //For new Switch
    const [ptoToBeRemoved, setPTOToBeRemoved] = useState(false)
    const [daysToChange, setDaysToChange] = useState(0);
    const [daysIsValid, setDaysIsValid] = useState(false)
    const [daysErrTxt, setDaysErrTxt] = useState("")

    const showModal = () => {setShowEditModal(true)}
    const hideModal = () => {setShowEditModal(false)}

    const showPto = () => {
        setShowPtoModal(true) 
        setNeedsRefresh(true)
    }

    const hidePto = () => {
        setShowPtoModal(false)
        // flag that we need to refresh the user data from state when PTO modal is closed
        // possible TODO: use global state directly in this screen instead of duplicating state,
        // which would allow circumventing this
        updatePTOAdmin({ showEditPtoModal: false })
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

                //TODO: Bug - after editing PTO, the only data that shows when entering the modal
                //again is the remaining pto days
                //When logging data here, the only attribute is the remaining pto days
                //for unedited users, all attributes show
                console.log("Data in Refresh UseEffect: ", data)
            }
        })()
    }, [needsRefresh])


    useEffect(()=>{
        const getData = async(id) => {
         
            let data = await getOrLoadUserBioInfo(userId, bioInfoContext)
            setUserData(data)
            
            //Whenever this screen is entered we know we want to show the modal
            setShowPtoModal(true)

            console.log("Data in getData useEffect: ", data)
            console.log("BioInfoContext ", bioInfoContext)
            console.log("BioState: ", bioState)

            if(data.isSupervisor){
                setCanEditOthers(true)
            }
            
            // supervisor data
            const superId = data.supervisorId
            if(superId){ // the id can be null in the database if the user has no manager/supervisor
                const supervisorData = await getOrLoadUserBioInfo(superId, bioInfoContext)
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
            //TODO: Is this required?
            // const teamId = data.teamId
            // const teamInfo = await getOrLoadTeamInfo(teamId, bioInfoContext)
            // setTeamData(teamInfo)

            // set profle picture
            // const img = await getOrLoadProfileImage(id, bioInfoContext)
            // setImgUrl(img)

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

            //TODO - Fixed bug
            setNeedsRefresh(true)
        }
        getData(userId)
        
    },[])

    //Parameters that are usually passed to PTOModal from logic above

    const supervisorId = userData.supervisorId
    const isShown = showPtoModal
    const dismiss = hidePto
    const pto = userData.remainingPTODays
    const sick = userData.remainingSickDays

    console.log("SICK: ", sick)

    /*
    Start of logic contained in the PTOModal / PTORequestScreen
    */

    const [requestInfo, setRequestInfo] = useState({
        category: false, // PTO = false, Sick = true
        reason: "",
        from: new Date(),
        until: new Date(),
        alert: " ",
    })


    // STATE MANAGEMENT FUNCTIONS START HERE
    const toggleAddRemoveSwitch = () => {

        setPTOToBeRemoved(!ptoToBeRemoved)
    }

    const handleDaysChange = (value) => {

        //Value is a String, so convert to int
        setDaysToChange(parseInt(value));

        //If remove toggled, make daysToChange a negative
        if(ptoToBeRemoved){

            setDaysToChange(parseInt(value * -1));

        }





        if (value.length === 0) {
        setDaysIsValid(false);
        setDaysErrTxt("Please enter a value");
        } else {
        setDaysIsValid(true);
        setDaysErrTxt("");
        }
    };

    const toggleSwitch = () => {
        setRequestInfo(prev => {
            const newRequestInfo = {...prev}
            newRequestInfo.category = !prev.category
            return newRequestInfo 
    })}

    const updateReason = (e) => {
        setRequestInfo(prev => {
            const newRequestInfo = {...prev}
            newRequestInfo.reason = e 
            return newRequestInfo
        })
    }

    const setFromDate = (date) => {
        setRequestInfo(prev => {
            const newRequestInfo = {...prev}
            newRequestInfo.from = date 
            return newRequestInfo
        })
    }

    const setUntilDate = (date) => {
        setRequestInfo(prev => {
            const newRequestInfo = {...prev}
            newRequestInfo.until = date 
            return newRequestInfo
        })
    }

    const updateAlert = (msg) => {
        setRequestInfo(prev => {
            const newRequestInfo = {...prev}
            newRequestInfo.alert = msg
            return newRequestInfo
        })
    }
    // END OF STATE MANAGEMENT FUNCTIONS

    // This function takes the data entered by the user and creates a request in the system
    // If the request fails for any reason, it displays an alert
    // If it is requested successfully, displays a success message and closes the modal after a set time
    const requestTimeOff = async() => {
        let category = requestInfo.category ? "Sick" : "PTO"
        
        const result = await requestDays(userId, supervisorId, category, requestInfo.from, requestInfo.until, requestInfo.reason, bioInfoContext)

        if(result.errors.length == 0){
            updateAlert(result.message)
    
            setTimeout(()=>{
                // clears the alert before closing the modal
                clearAndClose()
            }, 2500)

            //setNeedsRefresh(true)
        }
        else{
            updateAlert(result.errors[0])
        }
    }


    // Show confirm alert, if okay pressed make changes
    // By this point, all sanity checking should be complete
    const showConfirmAlert = () =>
        Alert.alert('Confirm changes', `${userData.firstName}`, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => confirmPTOChange()},
        ]);

    const confirmPTOChange = async() => {
        let category = requestInfo.category ? "Sick" : "PTO"
        
       // const result = await requestDays(userId, supervisorId, category, requestInfo.from, requestInfo.until, requestInfo.reason, bioInfoContext)

       //RequestedById (first parameter) is just the currently logged in Admin
       const result = await updateAvailableDays(userId, category, daysToChange, bioInfoContext)


       console.log("RESULT: ", result)

        if(result.errors.length == 0){
            updateAlert(result.message)
    
            setTimeout(()=>{
                // clears the alert before closing the modal
                clearAndClose()
            }, 2500)
        }
        else{
            updateAlert(result.errors[0])
        }
    }

    const clearAndClose = () => {
        updateReason("")
        updateAlert(" ")
        dismiss()
    }

    if(loading){
        return(
            <View style={bioStyles.loading}>
                <LoadingIndicator/>
            </View>
        )
    }

    return(
        <Modal
        //visible={isShown}
        visible={showEditPtoModal}
        transparent={false}
        animationType="bottom"
        >
            <View style={styles.container}>
                <Text style={styles.nameLabel}>
                    Editing PTO for {userData.firstName} {userData.lastName}
                </Text>

                <AvailablePTO numPto={pto} numSick={sick}/>

                <View style={styles.btnContainer}>
                    <FromToDatePicker label={"From"} initialValue={requestInfo.from} setDate={setFromDate}/>
                    <FromToDatePicker label={"To"} initialValue={requestInfo.until} setDate={setUntilDate}/>
                </View>

                <Text style={styles.subtitle}>
                    Select category
                </Text>

                <PTOCategorySwitch initialValue={requestInfo.category} toggle={toggleSwitch} />

                <Text style={styles.subtitle}>
                    Select add or remove
                </Text>


                <PTOAddRemoveSwitch initialValue={ptoToBeRemoved} toggle={toggleAddRemoveSwitch} />
            
                {/* TODO: Keyboard covers input box */}
                <InputField
                label={ ptoToBeRemoved ? "Days to remove" : "Days to add"}
                value={requestInfo.reason}
                setValue={updateReason}
                autoCapitalize="sentences"
                onChangeText={handleDaysChange}
                keyboardType={"numeric"}
                />

                <InputMsgBox text={daysErrTxt}></InputMsgBox>

                <View style={styles.btnContainer}>
                    <UiButton
                    label={"Cancel"}
                    funcToCall={clearAndClose}
                    type="default"
                    />
                    <UiButton
                    label={"Confirm"}
                    funcToCall={showConfirmAlert}
                    type="primary"
                    />
                </View>
                <Text>
                    {requestInfo.alert}
                </Text>
            </View>
        </Modal>
    )
}
export default PTOEditScreen