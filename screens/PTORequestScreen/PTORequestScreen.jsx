import { useState, useEffect } from "react";
import { View, Text, Modal, Button } from "react-native";
import AvailablePTO from "../../components/userBio/AvailablePTO/AvailablePTO";
import PTOCategorySwitch from "../../components/userBio/PTOCategorySwitch/PTOCategorySwitch";
import styles from "./PTORequestScreenStyles";
import UiButton from "../../components/common/UiButton/UiButton";
import InputField from "../../components/common/InputField/InputField";
import FromToDatePicker from "../../components/userBio/FromToDatePicker/FromToDatePicker";
import { requestDays } from "../../services/database/ptoManagement";
import { getUserBioInfoById } from "../../services/database/userBioInfo";


const PTORequestScreen = ({userId, supervisorId, isShown, dismiss, pto, sick, updateInfo}) => {

    const [requestInfo, setRequestInfo] = useState({
        category: false, // PTO = false, Sick = true
        reason: "",
        from: new Date(),
        until: new Date(),
        alert: " ",
    })

    // STATE MANAGEMENT FUNCTIONS START HERE
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
        
        const result = await requestDays(userId, supervisorId, category, requestInfo.from, requestInfo.until, requestInfo.reason)

        if(result.errors.length == 0){
            updateAlert(result.message)
    
            updateInfo(await getUserBioInfoById(userId))
    
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


    return(
        <Modal
        visible={isShown}
        transparent={false}
        animationType="bottom"
        >
            <View style={styles.container}>
                <Text style={styles.nameLabel}>
                    Days remaining
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
                
                <InputField
                label={"Reason"}
                value={requestInfo.reason}
                setValue={updateReason}
                autoCapitalize="sentences"
                />

                <View style={styles.btnContainer}>
                    <UiButton
                    label={"Cancel"}
                    funcToCall={clearAndClose}
                    type="default"
                    />
                    <UiButton
                    label={"Request"}
                    funcToCall={requestTimeOff}
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
export default PTORequestScreen