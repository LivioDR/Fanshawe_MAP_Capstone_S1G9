import { firestore as db } from "../../config/firebase"
import { doc, collection, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore"

const usersColName = "usersInfo"
const ptoColName = "daysOffRequests"

// Returns the number of days available for a user in the passed category
const checkAvailableDays = async(userId, category) => {
    const dbCategory = `remaining${category.trim()}Days` // PTO || Sick
    let numberOfDaysToReturn
    let errors = []
    try{
        const docRef = doc(db,usersColName, userId)
        const document = await getDoc(docRef)
        if (document.exists()) {
            userData = document.data()
            numberOfDaysToReturn = userData[dbCategory]
        } 
        else {
            console.debug("Document not found");
        }
    }
    catch(e){
        errors.push(e)
    }
    return {
        errors: errors,
        message: numberOfDaysToReturn
    }
}

// Add or subtracts the number of days passed to the daysToAdd variable for a user in the set category
// To add days pass a positive value, to subtract, pass a negative value
const updateAvailableDays = async(userId, category, daysToAdd) => {
    const dbCategory = `remaining${category.trim()}Days` // PTO || Sick
    let availableDays

    const requestAvailableDays = await checkAvailableDays(userId, category)
    if(!requestAvailableDays.errors){
        availableDays = requestAvailableDays.message
    }
    else{
        return {
            errors: requestAvailableDays.errors,
            message: "An error occurred while retrieving the available days data"
        }
    }

    try{
        const docRef = doc(db,usersColName, userId)
        const document = await updateDoc(docRef, {[dbCategory]: availableDays + daysToAdd})
        if (document.exists()) {
            userData = document.data()
            numberOfDaysToReturn = userData[dbCategory]
        } 
        else {
            console.debug("Document not found");
        }
    }
    catch(e){
        errors.push(e)
    }

}


// Creates a new request in the database
const requestDays = async(userId, managerId, category, requestedDays, from, until) => {


}

// Returns all the requests made to the manager of the passed ID
const getAllRequests = async(managerId) => {
    // creating an array to store all the requests to be displayed in the UI
    let arrayOfRequests = []
    let errors = []
    
    try{
        // getting a reference to the days off collection
        const colRef = collection(db, ptoColName)
        // setting the query with that reference and the conditions
        const query = query(colRef, where("reviewerId","==",managerId))
    
        // then getting the data from that query
        const querySnapshot = await getDocs(query)

        querySnapshot.forEach(snap => {
            arrayOfRequests.push({
                reqId: snap.id,
                reqData: snap.data()
            })
        })
    }
    catch(e){
        errors.push(e)
    }
    return {
        errors: errors,
        message: arrayOfRequests
    }
}

const reviewRequest = async(reqId, requestedById, category, days, approval) => {
    let result = false
    let errors = []

    try{
        // getting the reference to the document to update
        const docRef = doc(db, ptoColName, reqId)
        // setting then the isApproval status and the date when the update happended
        await updateDoc(docRef, {isApproved: approval, reviewedOn: new Date()})
        if(approval){
            // if the request was approved, updates the available days for the requester
            const updateReq = await updateAvailableDays(requestedById, category, days)
            if(!updateReq.errors){
                result = true
            }
            else{
                // reverting the update of the request due to the error found while updating the requested profile
                await updateDoc(docRef, {isApproved: null, reviewedOn: null})
                return {
                    errors: updateReq.errors,
                    message: updateReq.message
                }
            }
        }
        else{
            result = true
        }
    }
    catch(e){
        errors.push(e)
    }
    return {
        errors: errors,
        message: result
    }
}

export { checkAvailableDays, requestDays, getAllRequests, reviewRequest }