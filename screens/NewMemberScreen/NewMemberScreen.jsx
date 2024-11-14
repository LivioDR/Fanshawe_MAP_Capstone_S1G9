import { View, Text } from "react-native";
import InputField from "../../components/common/InputField/InputField";
import { useState } from "react";
import { useCredentials } from "../../services/state/userCredentials";
import { useBioInfo } from "../../services/state/userBioInfo";
import UiButton from "../../components/common/UiButton/UiButton";
import { addUserToTeam, createNewUser, isBirthDateInvalid, isEmailInvalid, sendRecoveryPassword } from "../../services/database/newUserCreation";
import { setUserBioInfoById } from "../../services/database/userBioInfo";



const NewMemberScreen = () => {
    
    // getting the userId and teamId for the supervisor who's creating the new team member
    const supervisorId = useCredentials().user.uid
    const teamId = useBioInfo().bios[supervisorId].teamId
    
    const defaultUserInfo = {
        onPTO: false,
        supervisorId: supervisorId,
        remainingPTODays: 15,
        remainingSickDays: 5,
        isEnabled: true,
        isSupervisor: false,
        salaried: false,
        teamId: teamId,
    }

    // Defining the state variables
    const [userInfo, setUserInfo] = useState(defaultUserInfo)
    const [errors, setErrors] = useState("")
    const [isBtnDisabled, setIsBtnDisabled] = useState(false)

    // And the fields to be completed
    const fields = [
        {
            name: 'firstName',
            label: 'First Name',
        },
        {
            name: 'lastName',
            label: "Last Name",
        },
        {
            name: 'address',
            label: 'Address',
        },
        {
            name: 'email',
            label: 'Email',
        },
        {
            name: 'birthday',
            label: 'Birth Date (YYYY-MM-DD)',
        },
        {
            name: 'role',
            label: 'Role',
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
            setErrors("Name can't be empty")
            return
        }

        // Then checks the address
        if(!userInfo.address || userInfo.address.trim() == ""){
            setErrors("Address can't be empty")
            return
        }

        // Verifies that the email has a valid format
        if(isEmailInvalid(userInfo.email)){
            setErrors("Please enter a valid email")
            return
        }

        // As well as the birth date
        if(isBirthDateInvalid(userInfo.birthday)){
            setErrors("Please enter a birth date in the valid format")
            return
        }

        // At last, checks the role
        if(!userInfo.role || userInfo.role.trim() == ""){
            setErrors("Role can't be empty")
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
            setErrors(`An error occurred: ${formattedError}`)
            setIsBtnDisabled(false)
            return
        }

        // Setting the data for this new user in the database
        const userInfoSettingResult = await setUserBioInfoById(userCreationResult.uid, userInfo)
        // And adding the user to the team
        const teamInfoSettingResult = await addUserToTeam(userCreationResult.uid, teamId)

        // Checking if the process went well
        if(userInfoSettingResult && teamInfoSettingResult){

            const recoveryResult = await sendRecoveryPassword(userInfo.email.trim())
            if(recoveryResult){
                setErrors("User created successfully!")
                clearAllFields()
            }
            else{
                setErrors("An error occurred while sending the recovery email to the new user")
            }
            setIsBtnDisabled(false)
        }
        else{
            setErrors("An error has occurred while writing the user info to the database")
            setIsBtnDisabled(false)
        }
    }


    // UI to be rendered by this component
    return(
        <View style={{flex: 1, height: '100%', width: '100%', justifyContent: 'space-evenly', alignItems: 'center',}}>
            {
                fields.map(field => <InputField key={field.name} label={field.label} value={userInfo[field.name]} setValue={(e)=>{setField(e, field.name)}} />)
            }
            <Text>{errors}</Text>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', width: '100%',}}>
                <UiButton label={"Clear"} type={"warning"} disabled={isBtnDisabled} funcToCall={clearAllFields} />
                <UiButton label={"Add member"} type={"primary"} disabled={isBtnDisabled} funcToCall={sendRequest} />
            </View>
        </View>
    )
}

export default NewMemberScreen