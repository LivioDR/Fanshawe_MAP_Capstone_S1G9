import { useEffect, useState } from "react";
import { Alert, View, Text, Modal } from "react-native";
import { useRoute } from "@react-navigation/native";

// UI imports
import styles from "./PTOEditScreenStyles";
import bioStyles from "../UserBioScreen/UserBioStyles";
import PTOCategorySwitch from "../../components/userBio/PTOCategorySwitch/PTOCategorySwitch";
import PTOAddRemoveSwitch from "../../components/userBio/PTOAddRemoveSwitch/PTOAddRemoveSwitch";
import UiButton from "../../components/common/UiButton/UiButton";
import InputField from "../../components/common/InputField/InputField";
import InputMsgBox from "../../components/InputMsgBox";
import AvailablePTO from "../../components/userBio/AvailablePTO/AvailablePTO";
import LoadingIndicator from "../../components/common/LoadingIndicator";

// Business logic imports
import { useBioInfo } from "../../services/state/userBioInfo";
import { usePTOAdmin } from "../../services/state/ptoAdmin";
import { updateAvailableDays } from "../../services/database/ptoManagement";

//Updated methods
import { getUserBioInfoById } from "../../services/database/userBioInfo";


/*
Getting the ID from the pressed card
This id uses similar logic to the UserBio component to get other data for 
the PTO screen

Migration from Context to DB functions (PTOAdmin is okay as reserved for this)

Context wrappers used: 
import { useBioInfo, getOrLoadUserBioInfo } from "../../services/state/userBioInfo";
import { getOrLoadOpenTimeLog, useTimeLog } from "../../services/state/timeClock";
import { useCredentials } from "../../services/state/userCredentials";

Current Methods and their DB equivalent
---------------------------
useBioInfo - 
getOrLoadUserBioInfo - getUserBioInfoById(userId) [X]
getOrLoadOpenTimeLog - Not needed
useTimeLog - Not needed
useCredentials - Not needed, as passing in userId as a prop from the pressed UserCard

Methods to change
---------------------------

useBioInfo / bioInfoContext - userBioInfo in context - 
getOrLoadUserBioInfo  === getUserBioInfoById(userId)


Get the UserBioInfo here and set it in the PTOAdminglobal state?


UI
-Make sure after days added/removed that the teamPTOScreen refreshes to show updated data
-Fix loading implementation for UI

*/

const PTOEditScreen = ({userId}) => {

    //Getting global show from the state:
    const { updatePTOAdmin, showEditPtoModal } = usePTOAdmin()

    const bioInfoContext = useBioInfo()
    const bioState = useBioInfo()

    /*
    Using this instead of bioState and bioInfoContext
    */
    async function fetchAndPrintBio(userId) {
        try {
            const myBio = await getUserBioInfoById(userId);
            console.log("MyBio: ", myBio);
            console.log("Userdata: ", userData)
            //Todo: save this Bio to a local state? - mybio and userdata returning the same data
            //Use userdata instead of bio?
        } catch (error) {
            console.error("Error fetching bio: ", error);
        }
    }
    fetchAndPrintBio(userId)

    /*
    Using logic from UserBio.jsx to convert the userId into data suitable for the screen
    Returns: userId, userData.supervisorId, showPtoModal, hidePto, 
    */

    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState({})
    const [superData, setSuperData] = useState({})
    const [canEditOthers, setCanEditOthers] = useState(false)
    const [showPtoModal, setShowPtoModal] = useState(true)
    const [needsRefresh, setNeedsRefresh] = useState(true) //change to true, as need refresh whenever loading

    //For new Switch
    const [daysToBeRemoved, setDaysToBeRemoved] = useState(false)
    const [daysToChange, setDaysToChange] = useState(0);
    const [daysIsValid, setDaysIsValid] = useState(false)
    const [daysErrTxt, setDaysErrTxt] = useState("")

    const hidePto = () => {
        setShowPtoModal(false)
        updatePTOAdmin({ showEditPtoModal: false })
        setNeedsRefresh(true)
    }
    
    const route = useRoute()
    if (route && route.params?.id) {
        userId = route.params.id
    }

    // set an effect that refreshes the current user's bio data if it's needed
    useEffect(() => {
        (async () => {
            if (needsRefresh) {
                const data = await getUserBioInfoById(userId)
                setUserData(data)
                setNeedsRefresh(false)
                console.log("Data in Refresh UseEffect: ", data)
            }
        })()
    }, [needsRefresh])


    useEffect(()=>{
        const getData = async(id) => {
         
            let data = await getUserBioInfoById(userId)
            setUserData(data)
            //Whenever this screen is entered we know we want to show the modal
            setShowPtoModal(true)

            console.log("Data in getData useEffect: ", data)
            console.log("BioInfoContext ", bioInfoContext)
            console.log("BioState: ", bioState)

            if(data.isSupervisor){
                setCanEditOthers(true)
            }
            
            const superId = data.supervisorId
            if(superId){ // the id can be null in the database if the user has no manager/supervisor
                const supervisorData = await getUserBioInfoById(superId)
                setSuperData(supervisorData)
            }
            else{
                setSuperData({
                    firstName: 'N/A',
                    lastName: '',
                    email: 'N/A',
                })
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


    /*
    Start of logic contained in the PTOModal / PTORequestScreen
    */

    //Reuqestinfo is needed to get the correct category
    const [requestInfo, setRequestInfo] = useState({
        category: false, // PTO = false, Sick = true
        reason: "",
        from: new Date(),
        until: new Date(),
        alert: " ",
    })


    // STATE MANAGEMENT FUNCTIONS START HERE
    const toggleAddRemoveSwitch = () => {

        setDaysToBeRemoved(!daysToBeRemoved)
    }

    const handleDaysChange = (value) => {

        const valueAsInt = parseInt(value);

        console.log("Val as int ", valueAsInt);
        console.log("PTO ", pto);
        console.log("Days to be removed ", daysToBeRemoved);

        //Value is a String, so convert to int
        setDaysToChange(parseInt(value));

        //If remove toggled, make daysToChange a Snegative
        if(daysToBeRemoved){

            setDaysToChange(parseInt(value * -1));

        }

        /*
        Logic

        Get current state from both toggles, if entered number breaks
        logic log error and disable button
        */

        //Getting state from toggles

        /*
        Value to adjust
        Whether days added or removed
        Whether sick days or pto days

        Adding days has no limit, so no checks needed here

        Condition 1 - No input - fail
        Condition 2 - NaN input - fail - Note: Need to convert value to an int first as input returns a screen
        Condition 3 - Removing days for PTO - If input number bigger than PTO number - fail
        Condition 4 - Removing days for sick - If input number bigger than sick number - fail

        Else input is valid

        */
        daysToChange
        daysToBeRemoved
        const category = requestInfo.category ? "Sick" : "PTO"

        console.log("Category ", category);

        if (value.length === 0) {

            setDaysIsValid(false);
            setDaysErrTxt("Please enter a number");

        }else if(isNaN(valueAsInt)){

            setDaysIsValid(false);
            setDaysErrTxt("Please enter a number");

        }else if(daysToBeRemoved && category === "PTO" && valueAsInt > pto){

            setDaysIsValid(false);
            setDaysErrTxt("Cannot remove more PTO days than a user has");

        }else if(daysToBeRemoved && category === "Sick" && valueAsInt > sick){

            setDaysIsValid(false);
            setDaysErrTxt("Cannot remove more sick days than a user has");
    
        }else {

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

    const updateAlert = (msg) => {
        setRequestInfo(prev => {
            const newRequestInfo = {...prev}
            newRequestInfo.alert = msg
            return newRequestInfo
        })
    }
    // END OF STATE MANAGEMENT FUNCTIONS


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

                <Text style={styles.subtitle}>
                    Select category
                </Text>

                <PTOCategorySwitch initialValue={requestInfo.category} toggle={toggleSwitch} />

                <Text style={styles.subtitle}>
                    Select add or remove
                </Text>


                <PTOAddRemoveSwitch initialValue={daysToBeRemoved} toggle={toggleAddRemoveSwitch} />
            
                {/* TODO: Keyboard covers input box */}
                <InputField
                label={ daysToBeRemoved ? "Days to remove" : "Days to add"}
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
                    disabled={!daysIsValid}
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