import { createContext, useContext, useState } from "react";

import { createTimeLog, getOpenTimeLog, updateTimeLog as updateTimeLogDB } from "../database/timeClock";

const defaultState = {
    logs: {},
};

const TimeLogContext = createContext(defaultState);

export function TimeLogProvider({ children }) {
    const [state, setState] = useState(defaultState);

    const updateLog = (newState) => {
        setState({ ...state, ...newState });
    };

    return (
        <TimeLogContext.Provider value={{ ...state, updateLog }}>
            {children}
        </TimeLogContext.Provider>
    );
}

export function useTimeLog() {
    return useContext(TimeLogContext);
}

/**
 * Retrieve from state or load the open time log for the specified user, if there is one.
 * @param {object} timeLogState current time log state from useTimeLog
 * @returns the currently open time log, or undefined if not found
 */
export async function getOrLoadOpenTimeLog(userId, timeLogState) {
    if (timeLogState.logs[userId]) {
        return timeLogState.logs[userId];
    }

    const timeLog = await getOpenTimeLog(userId);

    if (timeLog) {
        timeLogState.updateLog({ logs: { ...timeLogState.logs, [userId]: timeLog } });
    }

    return timeLog;
}

/**
 * Update the specified user's currently open time log with state support.
 * @param {string} userId user ID to update
 * @param {object} data time log data to update
 * @param {object} timeLogState current time log state object
 * @returns true if successful, false if failed
 */
export async function updateTimeLog(userId, data, timeLogState) {
    // assume update will be successful and update state first
    // save current state in case we need to revert state
    const lastTimeLog = timeLogState.logs[userId];
    const newState = { logs: { ...timeLogState.logs, [userId]: { ...lastTimeLog, ...data } } }
    timeLogState.updateLog(newState);

    // do database update
    const success = await updateTimeLogDB(data);

    // revert state on failure
    if (!success) {
        timeLogState.updateLog({ logs: { ...timeLogState.logs, [userId]: lastTimeLog } });
    }

    return success;
}

/**
 * Create a new time log for the specified user, clocking in at the specified time.
 * @param {string} userId user ID to clock in
 * @param {Timestamp} clockInTime time the user clocked in
 * @param {object} timeLogState current time log state object
 * @returns created TimeLog, or undefined if failed for some reason
 */
export async function clockIn(userId, clockInTime, timeLogState) {
    // attempt creating a new time log first
    const newTimeLog = await createTimeLog(userId, clockInTime);

    // failed, return the undefined time log
    if (!newTimeLog) {
        return newTimeLog;
    }

    // update state with new time log
    timeLogState.updateLog({ logs: { ...timeLogState.logs, [userId]: newTimeLog } });

    // return created time log
    return newTimeLog;
}

/**
 * Clock out the specified user, closing the open time log and deleting it from state.
 * @param {string} userId user ID to clock out
 * @param {TimeLog} closedTimeLog updated time log that we're closing
 * @param {object} timeLogState current time log state object
 * @returns true if successful, false if failed
 */
export async function clockOut(userId, closedTimeLog, timeLogState) {
    // update database first
    const success = await updateTimeLogDB(closedTimeLog);

    // if failed, just return false
    if (!success) {
        return false;
    }

    // successful update in DB, remove time log from state
    const newLogs = { ...timeLogState.logs };
    delete newLogs[userId];
    timeLogState.updateLog({ logs: newLogs });

    return true;
}