import { createContext, useContext, useState } from "react";

import { getOpenTimeLog } from "../database/timeClock";

const defaultState = {
    logs: {},
};

const TimeLogContext = createContext(defaultState);

export function TimeLogProvider({ children }) {
    const [state, setState] = useState(defaultState);

    const updateTimeLog = (newState) => {
        setState({ ...state, ...newState });
    };

    return (
        <TimeLogContext.Provider value={{ ...state, updateTimeLog }}>
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
        timeLogState.updateTimeLog({ logs: { ...timeLogState.logs, [userId]: timeLog } });
    }

    return timeLog;
}