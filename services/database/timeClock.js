import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { firestore as db } from "../../config/firebase";

const timeClockCollection = "timeClockData";

export class TimeLog {
    id = ""; userId = "";
    clockInTime = null; clockOutTime = null;
    onLunchTime = null; offLunchTime = null;
}

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

    let timeLog = new TimeLog();
    timeLog.userId = userId;
    snapshot.forEach((doc) => (
        Object.assign(timeLog, { ...doc.data(), id: doc.id })
    ));

    return timeLog;
}