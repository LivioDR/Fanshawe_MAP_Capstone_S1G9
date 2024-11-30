import { useTranslation } from "react-i18next";
import { View, Text } from "react-native";
import InputField from "../../components/common/InputField/InputField";
import { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import UiButton from "../../components/common/UiButton/UiButton";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import { addUserToTeam, createNewUser, isBirthDateInvalid, isEmailInvalid, sendRecoveryPassword } from "../../services/database/newUserCreation";
import { getUserBioInfoById, setUserBioInfoById } from "../../services/database/userBioInfo";

import { useTheme } from "../../services/state/useTheme";
import { darkMode, darkFont, darkBg } from "../../services/themes/themes";

const NewMemberScreen = () => {
    
    // getting the userId and teamId for the supervisor who's creating the new team member
    const supervisorId = auth.currentUser.uid;
    const [loading, setLoading] = useState(true);
    const [teamId, setTeamId] = useState("");

    const theme = useTheme()
    const isDarkMode = theme === darkMode
    
    const defaultUserInfo = {
        onPTO: false,
        supervisorId: supervisorId,
        remainingPTODays: 15,
        remainingSickDays: 5,
        isEnabled: true,
        isSupervisor: false,
        salaried: false,
    }

    // Defining the state variables
    const [userInfo, setUserInfo] = useState(defaultUserInfo)
    const [errors, setErrors] = useState("")
    const [isBtnDisabled, setIsBtnDisabled] = useState(false)

    const { t } = useTranslation()
    
    useEffect(() => {
        (async () => {
            const userInfo = await getUserBioInfoById(supervisorId);
            setTeamId(userInfo.teamId);
            defaultUserInfo.teamId = userInfo.teamId;
            setLoading(false);
        })()
    }, [])

    // And the fields to be completed
    const fields = [
        {
            name: 'firstName',
            label: t("profile.firstName"),
        },
        {
            name: 'lastName',
            label: t("profile.lastName"),
        },
        {
            name: 'address',
            label: t("profile.address"),
        },
        {
            name: 'email',
            label: t("profile.companyEmail"),
        },
        {
            name: 'birthday',
            label: t("profile.birthDate"),
        },
        {
            name: 'role',
            label: t("profile.role"),
        },
    ]

    // Function to handle the fields values and modify the state variable
    const setField = (e, fieldName) => {
        setUserInfo(prev => {
            let newInfo = {...prev}
            newInfo[fieldName] = e
            return newInfo
        })
    }

    // Function to clear all fields on request or after completing a user creation
    const clearAllFields = () => {
        setUserInfo(defaultUserInfo)
    }

    // This function validates the fields and the sends a request to the database to create a new user
    // After creating the new user it sends a password recovery email to the new user
    // Then clears all the fields in this screen
    const sendRequest = async() => {
        
        // START OF VALIDATIONS

        // Checks first name and last name to have data
        if(!userInfo.firstName || !userInfo.lastName || userInfo.firstName.trim() == "" || userInfo.lastName.trim() == ""){
            setErrors(t("errors.newMember.noName"))
            return
        }

        // Then checks the address
        if(!userInfo.address || userInfo.address.trim() == ""){
            setErrors(t("errors.newMember.noAddress"))
            return
        }

        // Verifies that the email has a valid format
        if(isEmailInvalid(userInfo.email)){
            setErrors(t("errors.login.invalidEmail"))
            return
        }

        // As well as the birth date
        if(isBirthDateInvalid(userInfo.birthday)){
            setErrors(t("errors.newMember.invalidBirthDate"))
            return
        }

        // At last, checks the role
        if(!userInfo.role || userInfo.role.trim() == ""){
            setErrors(t("errors.newMember.noRole"))
            return
        }

        setErrors("")

        // END OF VALIDATIONS

        // Disable the buttons while the request is being processed
        setIsBtnDisabled(true)

        // Starts the registration of the user
        // This function will take a base64 encoded string with all the user info as a default password
        // The user will be able to change it later
        const userCreationResult = await createNewUser(userInfo.email.trim(), btoa(JSON.stringify(userInfo)))

        // Checking any errors during this request
        if(userCreationResult.errors.length > 0){
            const error = userCreationResult.errors[0]
            const formattedError = error.split("/")[1].split("-").join(" ")
            setErrors(`${t("errors.unexpected")} ${formattedError}`)
            setIsBtnDisabled(false)
            return
        }

        // Setting the data for this new user in the database and in the state
        const userInfoSettingResult = await setUserBioInfoById(userCreationResult.uid, userInfo)
        // And adding the user to the team
        const teamInfoSettingResult = await addUserToTeam(userCreationResult.uid, teamId)

        // Checking if the process went well
        if(userInfoSettingResult && teamInfoSettingResult){

            const recoveryResult = await sendRecoveryPassword(userInfo.email.trim())
            if(recoveryResult){
                setErrors(t("team.addSuccess"))
                clearAllFields()
            }
            else{
                setErrors(t("errors.newMember.recoveryFailed"))
            }
            setIsBtnDisabled(false)
        }
        else{
            setErrors(t("errors.newMeber.saveFailed"))
            setIsBtnDisabled(false)
        }
    }

    if (loading) return(
        <View style={[{flex: 1, alignItems: 'center', justifyContent: 'center'}, isDarkMode ? darkBg : {}]}>
            <LoadingIndicator />
        </View>
    ) 

    // UI to be rendered by this component
    return(
        <View style={[{flex: 1, alignItems: 'center'}, isDarkMode ? darkBg : {}]}>
            {
                fields.map(field => <InputField key={field.name} label={field.label} value={userInfo[field.name]} setValue={(e)=>{setField(e, field.name)}} />)
            }
            <Text style={[{paddingHorizontal: "5%"}, isDarkMode ? darkFont : {}]}>{errors}</Text>
            <View style={{flexDirection: 'row', gap: 20, paddingHorizontal: "5%"}}>
                <UiButton
                    label={t("common.clear")}
                    type={"warning"}
                    disabled={isBtnDisabled}
                    funcToCall={clearAllFields}
                    customStyles={{wrapper: { flex: 1 }}}
                />
                <UiButton
                    label={t("team.addMember")}
                    type={"primary"}
                    disabled={isBtnDisabled}
                    funcToCall={sendRequest}
                    customStyles={{wrapper: { flex: 1 }}}
                />
            </View>
        </View>
    )
}

export default NewMemberScreen