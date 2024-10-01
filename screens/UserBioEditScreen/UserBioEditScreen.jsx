import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Modal } from "react-native";
import styles from "./UserBioEditScreenStyles";
import UiButton from "../../components/common/UiButton/UiButton";
import ImageUploadField from "../../components/userBioEdit/ImageUploadField/ImageUploadField";
import { updateUserBioInfoById } from "../../services/database/userBioInfo";

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
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>
                        Address
                    </Text>
                    <TextInput
                        style={styles.inputField}
                        autoCapitalize="words"
                        autoComplete="address-line1"
                        autoCorrect={false}
                        value={address}
                        onChange={newAddress => {setAddress(newAddress.nativeEvent.text)}}
                    />
                </View>
                <View style={styles.btnContainer}>
                    <UiButton
                        label={"Cancel"}
                        funcToCall={dismiss}
                    />
                    <UiButton
                        label={"Save"}
                        customStyles={{
                            wrapper: {
                                backgroundColor: '#DD0000',
                            },
                            textElem: {
                                color: 'white',
                            }
                        }}
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