import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Modal } from "react-native";
import styles from "./UserBioEditScreenStyles";
import UiButton from "../../components/common/UiButton/UiButton";
import ImageUploadField from "../../components/userBioEdit/ImageUploadField/ImageUploadField";
import { updateUserBioInfoById } from "../../services/database/userBioInfo";
import InputField from "../../components/common/InputField/InputField";

const UserBioEditScreen = ({userData, setUserData, uid, imgUrl, setImgUrl, dismiss, isShown}) => {

    const [address, setAddress] = useState(userData.address)
    const [alert, setAlert] = useState(null)

    useEffect(()=>{
        setAddress(userData.address)
    },[])

    const clearAlert    = () => setAlert(null)
    const errorAlert    = () => setAlert("An error occurred. Please try again later.")
    const successAlert  = () => setAlert("Changes saved successfully!")
    const emptyAlert    = () => setAlert("Please enter a valid address.")

    const updateUserInfo = async() => {
        // saving the user info in Firestore
        if(address && address?.trim() !== ''){
            setAlert(null)
            if(await updateUserBioInfoById(uid, {'address': address})){
                setUserData(prev => {
                    let newData = {...prev,
                        address: address,
                    }
                    return newData
                })
                // then close modal
                successAlert()
                setTimeout(()=>{
                    clearAlert()
                    dismiss()
                },1500)

            }
            else{
                errorAlert()
            }
        }
        else{
            emptyAlert()
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

                <ImageUploadField uid={uid} imgUrl={imgUrl} setImgUrl={setImgUrl} />

                <InputField
                    label={"Address"}
                    value={address}
                    setValue={setAddress}
                    autoComplete="address-line1"
                />

                <View style={styles.btnContainer}>
                    <UiButton
                        label={"Cancel"}
                        funcToCall={()=>{
                            clearAlert()
                            setAddress(userData.address)
                            dismiss()
                        }}
                    />
                    <UiButton
                        label={"Save"}
                        type="warning"
                        funcToCall={()=>{
                            // save data
                            updateUserInfo()
                        }}
                    />
                </View>
                {
                    alert &&
                    <Text>{alert}</Text>
                }
            </View>
        </Modal>
    )
}
export default UserBioEditScreen