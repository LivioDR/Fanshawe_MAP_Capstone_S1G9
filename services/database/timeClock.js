import { collection, query, where, getDocs, limit, orderBy, doc, updateDoc } from "firebase/firestore";
import { firestore as db } from "../../config/firebase";

const timeClockCollection = "timeClockData";

export class TimeLog {
    id = ""; userId = "";
    clockInTime = null; clockOutTime = null;
    onLunchTime = null; offLunchTime = null;
}

/**
 * Get the currently open (clocked in but not out) time log for a user.
 * Returns null if none is found.
 * @param {string} userId user ID to fetch for
 * @returns a TimeLog object, or null
 */
export async function getOpenTimeLog(userId) {
    // get list of time logs for this user with no clock out time
    // theoretically should be at most one
    const snapshot = await getDocs(
        query(
            collection(db, timeClockCollection),
            where("userId", "==", userId),
            where("clockOutTime", "==", null),
            orderBy("clockInTime"),
            limit(1)
        )
    );

    let timeLog = null;
    snapshot.forEach((doc) => (
        timeLog = Object.assign(new TimeLog(), { ...doc.data(), id: doc.id, userId })
    ));

    return timeLog;
}

/**
 * Update the specified time log in the database.
 * @param {TimeLog} timeLog time log with updated values
 * @returns true if successful, false if not
 */
export async function updateTimeLog(timeLog) {
    try {
        const { id, ...toUpdate } = timeLog;
        if (!id) {
            // can't update a log with no ID
            return false;
        }

        // update doc
        await updateDoc(doc(db, timeClockCollection, id), toUpdate);

        return true;
    } catch (error) {
        // catch and log any errors and return false
        console.error(`Error updating time log ${id}:`, error);
        return false;
    }
}