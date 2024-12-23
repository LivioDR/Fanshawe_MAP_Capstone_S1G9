import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, View, Text, Modal } from "react-native";

// UI imports
import styles from "./PTOEditScreenStyles";
import PTOCategorySwitch from "../../components/userBio/PTOCategorySwitch/PTOCategorySwitch";
import PTOAddRemoveSwitch from "../../components/userBio/PTOAddRemoveSwitch/PTOAddRemoveSwitch";
import UiButton from "../../components/common/UiButton/UiButton";
import InputField from "../../components/common/InputField/InputField";
import AvailablePTO from "../../components/userBio/AvailablePTO/AvailablePTO";

// Business logic imports
import { usePTOAdmin } from "../../services/state/ptoAdmin";
import { updateAvailableDays } from "../../services/database/ptoManagement";
import { getUserBioInfoById } from "../../services/database/userBioInfo";

// Theme imports
import { useTheme } from "../../services/state/useTheme";
import { darkMode, darkBg, darkFont } from "../../services/themes/themes";

/*
The PTOEditScreen (Presented as a modal)

- Enables an admin to add or remove either PTO or Sick days from any user
- Receives the ID from the pressed UserCard as a prop
- Uses this ID to call database functions directly  
- Sanity checking to ensure the user enters an integer, and that if removing
    days from user PTO or Sick days, that it cannot exceed the days a user has,
    preventing sending an unfeasible request to the database and handling the error there
- By design, no restriction on the amount of days that can be added

Global state specific for this functionality is used here (usePTOAdmin)
*/
const PTOEditScreen = ({userId}) => {

    const { updatePTOAdmin, showEditPtoModal } = usePTOAdmin()

    /*
    Using logic from UserBio.jsx to convert the userId into data suitable for the screen
    Returns: userId, userData.supervisorId, showPtoModal, hidePto, 
    */
    const [userData, setUserData] = useState({})
    const [needsRefresh, setNeedsRefresh] = useState(true) 

    //States for the PTOAddRemoveSwitch and User input
    const [daysToBeRemoved, setDaysToBeRemoved] = useState(false)
    const [daysToChange, setDaysToChange] = useState(0);
    const [daysIsValid, setDaysIsValid] = useState(false)
    const [daysErrTxt, setDaysErrTxt] = useState(" ")

    const { t } = useTranslation()

    const theme = useTheme()
    const isDarkMode = theme === darkMode

    const hidePto = () => {
        updatePTOAdmin({ showEditPtoModal: false })
        setNeedsRefresh(true)
    }

    // set an effect that refreshes the current user's bio data if it's needed
    useEffect(() => {
        (async () => {
            if (needsRefresh) {
                const data = await getUserBioInfoById(userId)
                setUserData(data)
                setNeedsRefresh(false)
            }
        })()
    }, [needsRefresh])


    useEffect(()=>{
        const getData = async(id) => {
         
            let data = await getUserBioInfoById(userId)
            setUserData(data)
            setNeedsRefresh(true)
        }
        getData(userId)
        
    },[])

    //Parameters that are usually passed to PTOModal from logic above
    const dismiss = hidePto
    const pto = userData.remainingPTODays
    const sick = userData.remainingSickDays

    /*
    Start of logic contained in the PTOModal / PTORequestScreen
    */

    //Request info is needed to get the correct category
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

    /*
    This useEffect ensures that input is validated whenever:
    - Input changes
    - The add / remove toggle value changes
    - The category toggle value changes
    */
    useEffect(() => {

        const category = requestInfo.category ? "Sick" : "PTO"
        const valueAsInt = parseInt(daysToChange)
        validateDays(valueAsInt, category)
        
    }, [daysToChange, daysToBeRemoved, requestInfo.category]);

    /*
    Value is a String, so convert to int
    Only care about the absolute value here, as the polarity
    is determined when the user clicks confim by the value of daysToBeRemoved
    */
    const handleDaysChange = (value) => {

        const valueAsInt = parseInt(value)
        setDaysToChange(valueAsInt)
        setNeedsRefresh(true)
    };

    /*
    Input validation

    Adding days has no limit, so no checks needed here
    Condition 1 - No input - fail
    Condition 2 - NaN input - fail - Note: Need to convert value to an int first as input returns a screen
    Condition 3 - Removing days for PTO - If input number bigger than PTO number - fail
    Condition 4 - Removing days for sick - If input number bigger than sick number - fail
    Else input is valid
    */
    const validateDays = (value, category) => {

        if (value.length === 0) {

            setDaysIsValid(false)
            setDaysErrTxt(t("errors.bio.pto.noNumber"));

        }else if(isNaN(value)){

            setDaysIsValid(false)
            setDaysErrTxt(t("errors.bio.pto.noNumber"));

        }else if(daysToBeRemoved && category === "PTO" && value > pto){

            setDaysIsValid(false)
            setDaysErrTxt(t("errors.bio.pto.notEnoughRemove"));

        }else if(daysToBeRemoved && category === "Sick" && value > sick){

            setDaysIsValid(false)
            setDaysErrTxt(t("errors.bio.pto.notEnoughRemove"));
    
        }else {

            setDaysIsValid(true)
            setDaysErrTxt("")
        }
    }

    const toggleSwitch = () => {
        setRequestInfo(prev => {
            const newRequestInfo = {...prev}
            newRequestInfo.category = !prev.category
            return newRequestInfo 
    })}

    const updateAlert = (msg) => {
        setRequestInfo(prev => {
            const newRequestInfo = {...prev}
            newRequestInfo.alert = msg
            return newRequestInfo
        })
    }
    // END OF STATE MANAGEMENT FUNCTIONS

    const showConfirmAlert = () => {
        const action = daysToBeRemoved ? "remove" : "add";
        const cat = requestInfo.category ? "Sick" : "PTO";
        
        Alert.alert(t("common.confirmChanges"), t(`team.ptoEdit.${action}${cat}Confirm`, { num: Math.abs(daysToChange), name: `${userData.firstName} ${userData.lastName}` }), [
          {
            text: t("common.cancel"),
            style: 'cancel',
          },
          {text: t(`common.${action}`), onPress: () => confirmPTOChange()},
        ]);
    }

    const confirmPTOChange = async() => {
        let category = requestInfo.category ? "Sick" : "PTO"

        // To fix bug identified in PR (wrong polarity when toggling add/remove after input)
        const valToChange = daysToBeRemoved ? -Math.abs(daysToChange) : Math.abs(daysToChange)

        //RequestedById (first parameter) is just the currently logged in Admin
        const result = await updateAvailableDays(userId, category, valToChange)

        if(result.errors.length == 0){
            updateAlert(result.message)
    
            setTimeout(()=>{
                clearAndClose()
            }, 500)
        }
        else{
            updateAlert(result.errors[0])
        }
    }

    const clearAndClose = () => {
        updateAlert(" ")
        dismiss()
    }

    return(
        <Modal
        visible={showEditPtoModal}
        transparent={false}
        animationType="bottom"
        >
            <View style={[styles.container, isDarkMode ? darkBg : {}]}>
                <Text style={[styles.nameLabel, isDarkMode ? darkFont : {}]}>
                    {t("team.ptoEdit.header", { name: `${userData.firstName} ${userData.lastName}` })}
                </Text>

                <AvailablePTO numPto={pto} numSick={sick}/>

                <View style={styles.switchContainer}>

                    <Text style={[styles.subtitle, isDarkMode ? darkFont : {}]}>
                        {t("profile.pto.selectCategory")}
                    </Text>

                    <PTOCategorySwitch initialValue={requestInfo.category} toggle={toggleSwitch} />

                </View>

                <View style={styles.switchContainer}>

                    <Text style={[styles.subtitle, isDarkMode ? darkFont : {}]}>
                        {t("team.ptoEdit.selectAction")}
                    </Text>

                    <PTOAddRemoveSwitch initialValue={daysToBeRemoved} toggle={toggleAddRemoveSwitch} />

                </View>
            
                <InputField
                label={t(`team.ptoEdit.${daysToBeRemoved ? "remove" : "add"}${requestInfo.category ? "Sick" : "PTO"}`)}
                value={daysToChange}
                setValue={setDaysToChange}
                onChangeText={handleDaysChange}
                keyboardType={"numeric"}
                />
                <View style={styles.errorTextContainer}>
                    <Text style={styles.errorText}>
                        {daysErrTxt}
                    </Text>
                </View>

                <View style={styles.btnContainer}>
                    <UiButton
                    label={t("common.cancel")}
                    funcToCall={clearAndClose}
                    type="default"
                    customStyles={{ wrapper: styles.button }}
                    />
                    <UiButton
                    label={t("common.confirm")}
                    funcToCall={showConfirmAlert}
                    type="primary"
                    disabled={!daysIsValid}
                    customStyles={{ wrapper: styles.button }}
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
