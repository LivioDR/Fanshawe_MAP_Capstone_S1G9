import { useState } from "react";
import { View, Text, Modal, Button } from "react-native";
import AvailablePTO from "../../components/userBio/AvailablePTO/AvailablePTO";
import PTOCategorySwitch from "../../components/userBio/PTOCategorySwitch/PTOCategorySwitch";
import styles from "./PTORequestScreenStyles";
import UiButton from "../../components/common/UiButton/UiButton";
import InputField from "../../components/common/InputField/InputField";
import FromToDatePicker from "../../components/userBio/FromToDatePicker/FromToDatePicker";


const PTORequestScreen = ({userId, isShown, dismiss, pto, sick, updateInfo}) => {

    const [requestInfo, setRequestInfo] = useState({
        category: false, // PTO = false, Sick = true
        reason: "",
        from: new Date(),
        until: new Date(),
        alert: " ",
    })

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
        console.debug(`From:`)
        console.debug(requestInfo)
    }

    const setUntilDate = (date) => {
        setRequestInfo(prev => {
            const newRequestInfo = {...prev}
            newRequestInfo.until = date 
            return newRequestInfo
        })
        console.debug(`Until:`)
        console.debug(requestInfo)
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
                    funcToCall={dismiss}
                    type="default"
                    />
                    <UiButton
                    label={"Request"}
                    // funcToCall={}
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