import { firestore as db } from "../../config/firebase";
import { auth } from "../../config/firebase";
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getTeamInfoById } from "./userBioInfo";

// Checks the email validity and returns a boolean value
const isEmailInvalid = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const emailRegexTest = emailRegex.test(email);

    return !emailRegexTest
}

const isBirthDateInvalid = (bdayString) => {
    const bdayRegex = /^\d{4}-\d{2}-\d{2}$/
    const bdayRegexTest = bdayRegex.test(bdayString)

    return !bdayRegexTest
}

const createNewUser = async(email, password) => {
    let uid
    let errors = []

    try{
        const result = await createUserWithEmailAndPassword(auth, email, password)
        uid = result.user.uid
    }
    catch(e){
        errors.push(e.code)
    }

    return {
        uid: uid,
        errors: errors,
    }
}

const addUserToTeam = async(userId, teamId) => {
    let result = false
    
    try{
        // get the original team info
        let teamInfo = await getTeamInfoById(teamId)
        // adds the user locally
        teamInfo.employees.push(userId)
        // then pushes the updated info to the database
        const docRef = doc(db, "teamsInfo", teamId)
        await updateDoc(docRef, teamInfo)

        result = true
    }
    catch(e){
        result = false
        console.error(e)
    }
    return result
}


const sendRecoveryPassword = async(email) => {
    let result = false
    await sendPasswordResetEmail(auth, email)
        .then(() => {
            result = true
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.debug(errorMessage)
            result = false
        });
    return result
}


export { isEmailInvalid, isBirthDateInvalid, createNewUser, addUserToTeam, sendRecoveryPassword }