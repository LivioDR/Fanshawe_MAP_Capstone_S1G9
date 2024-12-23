import i18next from "i18next"
import { firestore as db } from "../../config/firebase"
import { doc, collection, getDoc, getDocs, addDoc, query, where, updateDoc } from "firebase/firestore"
import { updateUserBioInfoById } from "./userBioInfo"

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
    let availableDays = 0
    let errors = []

    const requestAvailableDays = await checkAvailableDays(userId, category)

    if(requestAvailableDays.errors.length == 0){
        availableDays = requestAvailableDays.message
    }
    else{
        return {
            errors: [...errors, ...requestAvailableDays.errors],
            message: i18next.t("errors.bio.pto.getAvailableFailed")
        }
    }

    if(availableDays + daysToAdd < 0){
        return {
            errors: [i18next.t("errors.bio.pto.notEnoughDays", { availableDays, daysToAdd: -daysToAdd })],
            message: i18next.t("errors.bio.pto.notEnoughDays", { availableDays, daysToAdd: -daysToAdd })
        }
    }

    try{
        await updateUserBioInfoById(userId, {[dbCategory]: availableDays + daysToAdd})
    }
    catch(e){
        errors.push(e)
    }
    if(errors.length == 0){
        return {
            errors: errors,
            message: i18next.t("profile.pto.daysUpdateSuccess")
        }
    }
    else{
        return {
            errors: errors,
            message: i18next.t("errors.generic")
        }
    }
}


// Creates a new request in the database - QA OK
const requestDays = async(userId, managerId, category, from, until, reason) => {
    let result = false
    
    const requestedDays = Math.round(Math.abs((new Date(until).getTime() - new Date(from).getTime())) / (1000 * 60 * 60 * 24)) + 1 // the range is inclusive of both the first and last day
    
    try{
        // updating the available days for the requesting user, by passing a negative value to the updateAvailableDays function
        const updateReq = await updateAvailableDays(userId, category, -requestedDays)
        // then creating a request in the database
        if(updateReq.errors.length == 0){
            const colRef = collection(db, ptoColName)
            const document = await addDoc(colRef,{
                requesterId: userId,
                reviewerId: managerId,
                category: category,
                from: from,
                until: until,
                isApproved: null,
                reviewedOn: null,
                reason: reason,
                requestedDays: requestedDays,
            })
            result = true
        }
        else{
            return updateReq
        }
    }
    catch(e){
        return {
            message: i18next.t("errors.generic"),
            errors: [e]
        }
    }
    if(result){
        return {
            message: i18next.t("profile.pto.requestSuccess"),
            errors: []
        }
    }
    else{
        return {
            message: i18next.t("errors.generic"),
            errors: [i18next.t("errors.unexpected")]
        }
    }
}

// Returns all the requests made to the manager of the passed ID - QA OK
const getAllRequests = async(managerId) => {
    // creating an array to store all the requests to be displayed in the UI
    let arrayOfRequests = []
    let errors = []
    
    try{
        // getting a reference to the days off collection
        const colRef = collection(db, ptoColName)
        // setting the query with that reference and the conditions
        const q = query(colRef, where("reviewerId","==",managerId))
    
        // then getting the data from that query
        const querySnapshot = await getDocs(q)

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

// Gets a request information by its ID
const getRequestbyId = async(id) => {
    let requestInfo
    let errors = []
    try{
        const docRef = doc(db, ptoColName, id)
        const document = await getDoc(docRef)

        if(document.exists()){
            requestInfo = document.data()
        }
        else{
            errors.push(i18next.t("errors.pto.requestNotFound", { id }))
        }
    }
    catch(e){
        console.debug(e)
        errors.push(e)
    }
    return {
        errors: errors,
        message: requestInfo
    }
}


// Reviews a request made by an employee and updates the request status and the remaining days for that employee if approved
const reviewRequest = async(reqId, approval, bioState) => {
    let result = false
    let errors = []

    // gets all the info from the request in the database
    let requestInfo = await getRequestbyId(reqId)
    if(requestInfo.errors.length > 0){
        return {
            requestInfo
        }
    }
    else{
        requestInfo = requestInfo.message
    }

    // then I separate the variables that I'm going to use only from that request
    const category = requestInfo.category
    const days = requestInfo.requestedDays
    const requestedById = requestInfo.requesterId

    try{
        // getting the reference to the document to update
        const docRef = doc(db, ptoColName, reqId)

        // setting then the isApproval status and the date when the update happended
        await updateDoc(docRef, {
            isApproved: approval, 
            reviewedOn: new Date()
        })
        
        if(!approval){
            // if the request was not approved, updates the available days for the requester to restore the days previously subtracted when creating the request
            const updateReq = await updateAvailableDays(requestedById, category, days, bioState) // passing a positive value to give back the requested days on refusal

            if(updateReq.errors.length == 0){
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

export { checkAvailableDays, requestDays, getAllRequests, reviewRequest, updateAvailableDays }