import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { View, Text, Modal } from "react-native";
import styles from "./UserBioEditScreenStyles";
import UiButton from "../../components/common/UiButton/UiButton";
import ImageUploadField from "../../components/userBioEdit/ImageUploadField/ImageUploadField";
import InputField from "../../components/common/InputField/InputField";
import { updateUserBioInfoById } from "../../services/database/userBioInfo";

// Theme imports
import { useTheme } from "../../services/state/useTheme";
import { darkMode, darkBg, darkFont } from "../../services/themes/themes";

const UserBioEditScreen = ({userData, setUserData, uid, imgUrl, setImgUrl, dismiss, isShown}) => {

    const [address, setAddress] = useState(userData.address)
    const [alert, setAlert] = useState(null)

    const { t } = useTranslation()
    const theme = useTheme()
    const isDarkMode = theme === darkMode

    useEffect(()=>{
        setAddress(userData.address)
    },[])

    const clearAlert    = () => setAlert(null)
    const errorAlert    = () => setAlert(t("errors.generic"))
    const successAlert  = () => setAlert(t("common.saveSuccess"))
    const emptyAlert    = () => setAlert(t("errors.bio.invalidAddress"))

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
            <View style={[styles.container, isDarkMode ? darkBg : {}]}>

                <Text style={[styles.nameLabel, isDarkMode ? darkFont : {}]}>
                {`${userData.firstName} ${userData.lastName}`}
                </Text>

                <ImageUploadField uid={uid} imgUrl={imgUrl} setImgUrl={setImgUrl} />

                <InputField
                    label={t("profile.address")}
                    value={address}
                    setValue={setAddress}
                    autoComplete="address-line1"
                />

                <View style={styles.btnContainer}>
                    <UiButton
                        label={t("common.cancel")}
                        funcToCall={()=>{
                            clearAlert()
                            setAddress(userData.address)
                            dismiss()
                        }}
                        customStyles={{ wrapper: styles.button }}
                    />
                    <UiButton
                        label={t("common.save")}
                        type="warning"
                        funcToCall={()=>{
                            // save data
                            updateUserInfo()
                        }}
                        customStyles={{ wrapper: styles.button }}
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