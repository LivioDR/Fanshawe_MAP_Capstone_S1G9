import { useState } from "react";
import { View, Text, Modal, Button } from "react-native";
import AvailablePTO from "../../components/userBio/AvailablePTO/AvailablePTO";
import PTOCategorySwitch from "../../components/userBio/PTOCategorySwitch/PTOCategorySwitch";
import styles from "./PTORequestScreenStyles";
import UiButton from "../../components/common/UiButton/UiButton";
import InputField from "../../components/common/InputField/InputField";


const PTORequestScreen = ({userId, isShown, dismiss, pto, sick, updateInfo}) => {

    const [requestInfo, setRequestInfo] = useState({
        category: false, // PTO = false, Sick = true
        reason: "",
        from: "",
        until: "",
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