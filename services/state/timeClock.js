import { createContext, useContext, useState } from "react";

import { getOpenTimeLog, updateTimeLog as updateTimeLogDB } from "../database/timeClock";

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
        console.log("getting open time log from state");
        return timeLogState.logs[userId];
    }

    const timeLog = await getOpenTimeLog(userId);
    console.log("getting open time log from db");

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