import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Modal } from "react-native";
import styles from "./UserBioEditScreenStyles";
import UiButton from "../../components/common/UiButton/UiButton";
import ImageUploadField from "../../components/userBioEdit/ImageUploadField/ImageUploadField";
import { updateUserBioInfoById } from "../../services/database/userBioInfo";
import InputField from "../../components/common/InputField/InputField";

const UserBioEditScreen = ({userData, setUserData, uid, imgUrl, dismiss, isShown}) => {

    const [address, setAddress] = useState('')

    useEffect(()=>{
        setAddress(userData.address)
    },[])

    const updateUserInfo = async() => {
        // saving the user info in Firestore
        if(await updateUserBioInfoById(uid, {'address': address})){
            setUserData(prev => {
                let newData = {...prev,
                    address: address,
                }
                return newData
            })
        }
        else{
            console.error("An error occurred while updating the data")
        }
    }


    return(
        <Modal
            animationType="slide"
            transparent={false}
            visible={isShown}
        >
            <View style={styles.container}>
                <Text style={styles.nameLabel}>
                {`${userData.firstName} ${userData.lastName}`}
                </Text>
                <ImageUploadField imgUrl={imgUrl} />
                <InputField
                    label={"Address"}
                    value={address}
                    setValue={setAddress}
                    autoComplete="address-line1"
                />
                <View style={styles.btnContainer}>
                    <UiButton
                        label={"Cancel"}
                        funcToCall={dismiss}
                    />
                    <UiButton
                        label={"Save"}
                        type="warning"
                        funcToCall={()=>{
                            // save data
                            updateUserInfo()
                            // then close modal
                            dismiss()
                        }}
                    />
                </View>
            </View>
        </Modal>
    )
}
export default UserBioEditScreen