import { firestore as db } from "../../config/firebase";
import { doc, getDoc, addDoc } from "firebase/firestore";

const usersColName = "usersInfo"
const teamsColName = "teamsInfo"

const getUserBioInfoById = async(id) => {
    let userData
    try{
        const docRef = doc(db,usersColName, id)
        const document = await getDoc(docRef)
        if (document.exists()) {
            userData = document.data()
            userData.birthday = new Date(userData.birthday.seconds*1000).toLocaleDateString()
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

const setUserBioInfoById = async(id) => {

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

export { getUserBioInfoById, setUserBioInfoById, getTeamInfoById }