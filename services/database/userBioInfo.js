import { firestore as db } from "../../config/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const usersColName = "usersInfo"
const teamsColName = "teamsInfo"

const getUserBioInfoById = async(id) => {
    let userData
    try{
        const docRef = doc(db,usersColName, id)
        const document = await getDoc(docRef)
        if (document.exists()) {
            userData = document.data()
        } 
        else {
            console.error("Document not found");
        }
    }
    catch(e){
        console.error(e)
    }
    return userData
}

const setUserBioInfoById = async(id, userData) => {
    let result = false
    try{
        const docRef = doc(db, usersColName, id)
        await setDoc(docRef, userData)
        result = true
    }
    catch(e){
        console.error(e)
    }
    return result
}

const updateUserBioInfoById = async(id, infoToUpdate) => {
    let result = false
    try{
        const docRef = doc(db, usersColName, id)
        await updateDoc(docRef, infoToUpdate)
        result = true
    }
    catch(e){
        console.error(e)
    }
    return result
}

const getTeamInfoById = async(id) => {
    let teamData
    try{
        const docRef = doc(db,teamsColName, id)
        const document = await getDoc(docRef)
        if (document.exists()) {
            teamData = document.data()
        } 
        else {
            console.error("Team data not found");
        }
    }
    catch(e){
        console.error(e)
    }
    return teamData
}

export { getUserBioInfoById, setUserBioInfoById, updateUserBioInfoById, getTeamInfoById }